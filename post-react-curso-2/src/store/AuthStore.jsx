import { create } from "zustand";
import { supabase } from "../supabase/supabase.config";

export const useAuthStore = create((set) => ({
    loginGoogle: async () => {
        await supabase.auth.signInWithOAuth({ provider: 'google' });
    },
    loginEmail: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },
    registrarEmail: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    },
    cerrarSesion: async () => {
        await supabase.auth.signOut();
    }
}));
