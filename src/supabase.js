import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://eyphinrwgiaambnkcqik.supabase.co/";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cGhpbnJ3Z2lhYW1ibmtjcWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTc4NzMsImV4cCI6MjA4ODk5Mzg3M30.PDn3nTc6HtmGmp-lOyb3XZAIl4LTne0rUX-JaWiEdYw";

export const supabase = createClient(supabaseUrl, supabaseKey);