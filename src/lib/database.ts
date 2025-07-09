import { supabase } from './supabase'
import { PostgrestError } from '@supabase/supabase-js'

export interface DatabaseResponse<T> {
  data: T | null
  error: PostgrestError | null
}

export const database = {
  // Generic select function
  async select<T>(
    table: string,
    columns: string = '*',
    filters?: Record<string, any>
  ): Promise<DatabaseResponse<T[]>> {
    let query = supabase.from(table).select(columns)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const { data, error } = await query
    return { data: data as T[], error }
  },

  // Generic insert function
  async insert<T>(
    table: string,
    data: Record<string, any>
  ): Promise<DatabaseResponse<T>> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()
    
    return { data: result, error }
  },

  // Generic update function
  async update<T>(
    table: string,
    data: Record<string, any>,
    filters: Record<string, any>
  ): Promise<DatabaseResponse<T>> {
    let query = supabase.from(table).update(data)
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    
    const { data: result, error } = await query.select().single()
    return { data: result, error }
  },

  // Generic delete function
  async delete(
    table: string,
    filters: Record<string, any>
  ): Promise<{ error: PostgrestError | null }> {
    let query = supabase.from(table).delete()
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
    
    const { error } = await query
    return { error }
  },

  // Real-time subscription
  subscribeToTable<T>(
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    callback: (payload: T) => void
  ) {
    return supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes' as any,
        { event, schema: 'public', table },
        (payload: any) => callback(payload.new as T)
      )
      .subscribe()
  }
} 