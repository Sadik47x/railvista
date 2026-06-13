-- RailVista Database Schema
-- Phase 2: Supabase PostgreSQL Architecture

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- STATIONS TABLE
CREATE TABLE IF NOT EXISTS stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_code TEXT UNIQUE NOT NULL,
    station_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TRAINS TABLE
CREATE TABLE IF NOT EXISTS trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_number TEXT UNIQUE NOT NULL,
    train_name TEXT NOT NULL,
    train_category TEXT NOT NULL, -- e.g. Rajdhani, Duronto, Vande Bharat, Express
    source_station_id UUID REFERENCES stations(id) ON DELETE RESTRICT NOT NULL,
    destination_station_id UUID REFERENCES stations(id) ON DELETE RESTRICT NOT NULL,
    departure_time TEXT NOT NULL, -- e.g. "16:55"
    arrival_time TEXT NOT NULL,   -- e.g. "10:00"
    duration_minutes INTEGER NOT NULL, -- Duration of transit in minutes
    runs_on TEXT NOT NULL DEFAULT 'Daily', -- e.g. "Daily", "Mon, Wed, Fri"
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TRAIN STATIONS TABLE (ROUTE TIMELINE & SCHEDULE)
CREATE TABLE IF NOT EXISTS train_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID REFERENCES trains(id) ON DELETE CASCADE NOT NULL,
    station_id UUID REFERENCES stations(id) ON DELETE RESTRICT NOT NULL,
    arrival_time TEXT NOT NULL,   -- e.g. "18:57" or "--:--" for start
    departure_time TEXT NOT NULL, -- e.g. "18:59" or "--:--" for end
    stop_duration TEXT NOT NULL DEFAULT '2m', -- e.g. "2m", "10m", "--"
    stop_order INTEGER NOT NULL, -- 1-indexed stop sequence
    day INTEGER NOT NULL DEFAULT 1, -- Day 1, Day 2 of journey
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(train_id, stop_order)
);

-- COACHES TABLE
CREATE TABLE IF NOT EXISTS coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID REFERENCES trains(id) ON DELETE CASCADE NOT NULL,
    coach_name TEXT NOT NULL, -- e.g. A1, A2, B1, B2, S1
    coach_type TEXT NOT NULL, -- e.g. 1A, 2A, 3A, SL, CC, EC
    seat_count INTEGER NOT NULL, -- e.g. 24, 48, 64, 72, 78
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(train_id, coach_name)
);

-- SEATS TABLE
CREATE TABLE IF NOT EXISTS seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
    seat_number INTEGER NOT NULL,
    berth_type TEXT NOT NULL, -- e.g. LB (Lower), MB (Middle), UB (Upper), SL (Side Lower), SU (Side Upper), WS (Window Seat)
    status TEXT NOT NULL DEFAULT 'available', -- e.g. available, booked, blocked
    row_num INTEGER NOT NULL, -- Layout coordinates
    col_num INTEGER NOT NULL, -- Layout coordinates
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(coach_id, seat_number)
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pnr TEXT UNIQUE NOT NULL, -- 10-digit numeric PNR
    train_id UUID REFERENCES trains(id) ON DELETE RESTRICT NOT NULL,
    coach_id UUID REFERENCES coaches(id) ON DELETE RESTRICT NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled, pending
    journey_date DATE NOT NULL, -- DATE instead of TEXT
    total_fare NUMERIC(10, 2) NOT NULL,
    booking_date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- PASSENGERS TABLE
CREATE TABLE IF NOT EXISTS passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    seat_id UUID REFERENCES seats(id) ON DELETE RESTRICT NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    berth_preference TEXT NOT NULL DEFAULT 'None',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_stations_code ON stations(station_code);
CREATE INDEX IF NOT EXISTS idx_trains_number ON trains(train_number);
CREATE INDEX IF NOT EXISTS idx_train_stations_train_order ON train_stations(train_id, stop_order);
CREATE INDEX IF NOT EXISTS idx_coaches_train ON coaches(train_id);
CREATE INDEX IF NOT EXISTS idx_seats_coach ON seats(coach_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_passengers_booking ON passengers(booking_id);

-- SEAT RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS seat_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    seat_id UUID REFERENCES seats(id) ON DELETE RESTRICT NOT NULL,
    journey_date DATE NOT NULL, -- DATE type
    reservation_status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Partial unique index to enforce seat reservation availability by date
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_reservations 
ON seat_reservations(seat_id, journey_date) 
WHERE (reservation_status = 'confirmed');

-- Indexing for seat reservations
CREATE INDEX IF NOT EXISTS idx_reservations_date ON seat_reservations(journey_date);
CREATE INDEX IF NOT EXISTS idx_reservations_booking ON seat_reservations(booking_id);

-- Atomic Stored Procedure: Create Booking with Server-Side Fare Calculation & Pure 10-Digit PNR
CREATE OR REPLACE FUNCTION create_booking_transaction(
    p_train_id UUID,
    p_coach_id UUID,
    p_journey_date DATE,
    p_total_fare NUMERIC, -- accepted for interface compatibility, but we calculate/validate server-side
    p_booking_date TEXT,
    p_passengers JSONB
) RETURNS TABLE (booking_id UUID, pnr TEXT) AS $$
DECLARE
    v_booking_id UUID;
    v_pnr TEXT;
    v_exists BOOLEAN;
    v_passenger RECORD;
    v_seat_id UUID;
    v_seat_status TEXT;
    v_reserved_exists BOOLEAN;
    v_coach_type TEXT;
    v_base_fare NUMERIC;
    v_passenger_count INTEGER;
    v_calculated_subtotal NUMERIC;
    v_calculated_taxes NUMERIC;
    v_calculated_total NUMERIC;
BEGIN
    -- 1. Resolve the coach type to fetch base price
    SELECT coach_type INTO v_coach_type
    FROM coaches
    WHERE id = p_coach_id;

    IF v_coach_type IS NULL THEN
        RAISE EXCEPTION 'Coach not found';
    END IF;

    -- 2. Map coach_type to its base price (server-side fare validation)
    v_base_fare := CASE v_coach_type
        WHEN '1A' THEN 4200
        WHEN '2A' THEN 2800
        WHEN '3A' THEN 1900
        WHEN 'SL' THEN 700
        WHEN 'CC' THEN 2800
        WHEN 'EC' THEN 4900
        ELSE 1500 -- Default fallback price
    END;

    -- 3. Calculate fare: subtotal, taxes (5%), conv fee (50)
    v_passenger_count := jsonb_array_length(p_passengers);
    IF v_passenger_count IS NULL OR v_passenger_count = 0 THEN
        RAISE EXCEPTION 'Passenger list cannot be empty';
    END IF;

    v_calculated_subtotal := v_base_fare * v_passenger_count;
    v_calculated_taxes := round(v_calculated_subtotal * 0.05);
    v_calculated_total := v_calculated_subtotal + 50 + v_calculated_taxes;

    -- 4. Generate a unique 10-digit numeric PNR (pure numeric, no hyphens)
    LOOP
        v_pnr := (floor(random() * 9000000000) + 1000000000)::TEXT;
        SELECT EXISTS (SELECT 1 FROM bookings WHERE bookings.pnr = v_pnr) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;

    -- 5. Insert the booking record using calculated total fare
    INSERT INTO bookings (
        pnr,
        train_id,
        coach_id,
        booking_status,
        journey_date,
        total_fare,
        booking_date
    ) VALUES (
        v_pnr,
        p_train_id,
        p_coach_id,
        'confirmed',
        p_journey_date,
        v_calculated_total,
        p_booking_date
    ) RETURNING id INTO v_booking_id;

    -- 6. Loop through passengers JSON array
    FOR v_passenger IN SELECT * FROM jsonb_to_recordset(p_passengers) AS x(
        full_name TEXT,
        age INTEGER,
        gender TEXT,
        berth_preference TEXT,
        seat_number INTEGER
    ) LOOP
        -- Select and Lock the physical seat row to ensure inventory consistency (immutable train inventory)
        SELECT id, status INTO v_seat_id, v_seat_status
        FROM seats
        WHERE coach_id = p_coach_id AND seat_number = v_passenger.seat_number
        FOR UPDATE;

        IF v_seat_id IS NULL THEN
            RAISE EXCEPTION 'Seat number % does not exist in the selected coach', v_passenger.seat_number;
        END IF;

        -- Check physical status (seats are static train inventory, we don't modify seats.status to booked)
        IF v_seat_status != 'available' THEN
            RAISE EXCEPTION 'Seat number % is physically blocked or out-of-service', v_passenger.seat_number;
        END IF;

        -- Check if seat is already reserved (active 'confirmed') on the requested journey date
        SELECT EXISTS (
            SELECT 1 FROM seat_reservations 
            WHERE seat_id = v_seat_id AND journey_date = p_journey_date AND reservation_status = 'confirmed'
        ) INTO v_reserved_exists;

        IF v_reserved_exists THEN
            RAISE EXCEPTION 'Seat number % is already reserved on date %', v_passenger.seat_number, p_journey_date;
        END IF;

        -- Insert reservation record with status 'confirmed'
        INSERT INTO seat_reservations (
            booking_id,
            seat_id,
            journey_date,
            reservation_status
        ) VALUES (
            v_booking_id,
            v_seat_id,
            p_journey_date,
            'confirmed'
        );

        -- Insert passenger record
        INSERT INTO passengers (
            booking_id,
            seat_id,
            full_name,
            age,
            gender,
            berth_preference
        ) VALUES (
            v_booking_id,
            v_seat_id,
            v_passenger.full_name,
            v_passenger.age,
            v_passenger.gender,
            coalesce(v_passenger.berth_preference, 'None')
        );
    END LOOP;

    -- Return PNR and Booking ID
    RETURN QUERY SELECT v_booking_id, v_pnr;
END;
$$ LANGUAGE plpgsql;

-- Atomic Stored Procedure: Cancel Booking (Release Seat Reservations)
CREATE OR REPLACE FUNCTION cancel_booking_transaction(
    p_booking_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Check if booking exists and is confirmed
    IF NOT EXISTS (
        SELECT 1 FROM bookings WHERE id = p_booking_id AND booking_status = 'confirmed'
    ) THEN
        RAISE EXCEPTION 'Booking not found or already cancelled';
    END IF;

    -- Update booking status to cancelled
    UPDATE bookings
    SET booking_status = 'cancelled'
    WHERE id = p_booking_id;

    -- Update seat_reservations to released/cancelled instead of deleting
    UPDATE seat_reservations
    SET reservation_status = 'cancelled'
    WHERE booking_id = p_booking_id;
END;
$$ LANGUAGE plpgsql;
