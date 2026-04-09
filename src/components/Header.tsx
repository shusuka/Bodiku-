import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const loc = useLocation();
  const isHome = loc.pathname === '/';

  return (
    <header className="py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
            >
              🍭
            </motion.div>
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-[#3B2A4A] leading-none">
                Berat Badan
              </h1>
              <p className="font-body text-xs text-[#3B2A4A]/60 font-semibold">
                Tracker mingguan yang lucu~
              </p>
            </div>
          </motion.div>
        </Link>

        {!isHome && (
          <Link to="/" className="candy-btn-pink text-sm">
            ← Pulang
          </Link>
        )}
      </div>
    </header>
  );
}
