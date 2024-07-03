import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 100); // Delay to ensure the layout is mounted

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
