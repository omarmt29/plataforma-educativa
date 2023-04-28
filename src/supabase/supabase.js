import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emfjomsevzoytidqbiih.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZmpvbXNldnpveXRpZHFiaWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIzODk1NjMsImV4cCI6MTk5Nzk2NTU2M30.62jo5JuVhfXUQIbzgsiGI1Rsh1xegOBPPnUrYG8HP90'

export const supabase = createClient(supabaseUrl, supabaseKey)
