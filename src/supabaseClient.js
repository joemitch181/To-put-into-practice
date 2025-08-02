import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kntydqnjxnguwmixqomw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudHlkcW5qeG5ndXdtaXhxb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2Mzg4MTQsImV4cCI6MjA2OTIxNDgxNH0.MmNp_pQQK6tkV_QEkuLSfL8D8lmaNpfvOLO7ODKRxNI';

export const supabase = createClient(supabaseUrl, supabaseKey);
