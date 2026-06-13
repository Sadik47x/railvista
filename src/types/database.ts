// TypeScript Definitions for Supabase Database Schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      stations: {
        Row: {
          id: string
          station_code: string
          station_name: string
          city: string
          state: string
          created_at: string
        }
        Insert: {
          id?: string
          station_code: string
          station_name: string
          city: string
          state: string
          created_at?: string
        }
        Update: {
          id?: string
          station_code?: string
          station_name?: string
          city?: string
          state?: string
          created_at?: string
        }
        Relationships: []
      }
      trains: {
        Row: {
          id: string
          train_number: string
          train_name: string
          train_category: string
          source_station_id: string
          destination_station_id: string
          departure_time: string
          arrival_time: string
          duration_minutes: number
          runs_on: string
          created_at: string
        }
        Insert: {
          id?: string
          train_number: string
          train_name: string
          train_category: string
          source_station_id: string
          destination_station_id: string
          departure_time: string
          arrival_time: string
          duration_minutes: number
          runs_on?: string
          created_at?: string
        }
        Update: {
          id?: string
          train_number?: string
          train_name?: string
          train_category?: string
          source_station_id?: string
          destination_station_id?: string
          departure_time?: string
          arrival_time?: string
          duration_minutes?: number
          runs_on?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trains_source_station_id_fkey"
            columns: ["source_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trains_destination_station_id_fkey"
            columns: ["destination_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          }
        ]
      }
      train_stations: {
        Row: {
          id: string
          train_id: string
          station_id: string
          arrival_time: string
          departure_time: string
          stop_duration: string
          stop_order: number
          day: number
          created_at: string
        }
        Insert: {
          id?: string
          train_id: string
          station_id: string
          arrival_time: string
          departure_time: string
          stop_duration?: string
          stop_order: number
          day?: number
          created_at?: string
        }
        Update: {
          id?: string
          train_id?: string
          station_id?: string
          arrival_time?: string
          departure_time?: string
          stop_duration?: string
          stop_order?: number
          day?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "train_stations_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "train_stations_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          }
        ]
      }
      coaches: {
        Row: {
          id: string
          train_id: string
          coach_name: string
          coach_type: string
          seat_count: number
          created_at: string
        }
        Insert: {
          id?: string
          train_id: string
          coach_name: string
          coach_type: string
          seat_count: number
          created_at?: string
        }
        Update: {
          id?: string
          train_id?: string
          coach_name?: string
          coach_type?: string
          seat_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coaches_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          }
        ]
      }
      seats: {
        Row: {
          id: string
          coach_id: string
          seat_number: number
          berth_type: string
          status: string
          row_num: number
          col_num: number
          created_at: string
        }
        Insert: {
          id?: string
          coach_id: string
          seat_number: number
          berth_type: string
          status?: string
          row_num: number
          col_num: number
          created_at?: string
        }
        Update: {
          id?: string
          coach_id?: string
          seat_number?: number
          berth_type?: string
          status?: string
          row_num?: number
          col_num?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seats_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          pnr: string
          train_id: string
          coach_id: string
          booking_status: string
          journey_date: string
          total_fare: number
          booking_date: string
          created_at: string
        }
        Insert: {
          id?: string
          pnr: string
          train_id: string
          coach_id: string
          booking_status?: string
          journey_date: string
          total_fare: number
          booking_date: string
          created_at?: string
        }
        Update: {
          id?: string
          pnr?: string
          train_id?: string
          coach_id?: string
          booking_status?: string
          journey_date?: string
          total_fare?: number
          booking_date?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          }
        ]
      }
      passengers: {
        Row: {
          id: string
          booking_id: string
          seat_id: string
          full_name: string
          age: number
          gender: string
          berth_preference: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          seat_id: string
          full_name: string
          age: number
          gender: string
          berth_preference?: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          seat_id?: string
          full_name?: string
          age?: number
          gender?: string
          berth_preference?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "passengers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passengers_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          }
        ]
      }
      seat_reservations: {
        Row: {
          id: string
          booking_id: string
          seat_id: string
          journey_date: string
          reservation_status: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          seat_id: string
          journey_date: string
          reservation_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          seat_id?: string
          journey_date?: string
          reservation_status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_reservations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_reservations_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {
      create_booking_transaction: {
        Args: {
          p_train_id: string
          p_coach_id: string
          p_journey_date: string
          p_total_fare: number
          p_booking_date: string
          p_passengers: Json
        }
        Returns: {
          booking_id: string
          pnr: string
        }[]
      }
      cancel_booking_transaction: {
        Args: {
          p_booking_id: string
        }
        Returns: unknown
      }
      get_trains_by_route: {
        Args: {
          p_from_code: string
          p_to_code: string
        }
        Returns: {
          id: string
          train_number: string
          train_name: string
          train_category: string
          departure_time: string
          arrival_time: string
          duration_minutes: number
          runs_on: string
          source_station_code: string
          source_station_name: string
          destination_station_code: string
          destination_station_name: string
        }[]
      }
      get_train_class_summaries: {
        Args: {
          p_train_ids: string[]
          p_journey_date: string
        }
        Returns: {
          train_id: string
          coach_type: string
          total_seats: number
          available_seats: number
        }[]
      }
    }
    Enums: {}
  }
}
