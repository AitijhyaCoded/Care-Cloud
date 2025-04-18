
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useReminders = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReminders();
    // Set up real-time subscription
    const channel = supabase
      .channel('reminders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminders'
        },
        (payload) => {
          console.log('Reminder change received:', payload);
          fetchReminders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reminders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (reminder: any) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .insert([reminder]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Reminder added successfully',
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reminder',
        variant: 'destructive',
      });
    }
  };

  return { reminders, loading, addReminder };
};