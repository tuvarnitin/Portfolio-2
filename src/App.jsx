import { useState, useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTheme } from '@/store/themeSlice';
import Navbar from '@/components/layout/Navbar';
import Loader from '@/components/layout/Loader';
import CustomCursor from '@/components/layout/CustomCursor';
import Hero from '@/features/hero/Hero';
import About from '@/features/about/About';
import Skills from '@/features/skills/Skills';
import Experience from '@/features/experience/Experience';
import Projects from '@/features/projects/Projects';
import Footer from '@/components/layout/Footer';
import Lenis from 'lenis';

const Terminal = lazy(() => import('@/features/terminal/Terminal'));
const Dashboard = lazy(() => import('@/features/dashboard/Dashboard'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  // Initialize theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'light';
    dispatch(setTheme(saved));
  }, [dispatch]);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CustomCursor />
      {/* {loading && <Loader onComplete={handleLoadingComplete} />} */}

      <div>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Suspense fallback={null}>
            {/* <Dashboard /> */}
          </Suspense>
        </main>
        <Footer />
      </div>
      <Suspense fallback={null}>
        <Terminal />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
