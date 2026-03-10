import { motion } from "framer-motion";

export default function Isla5ImpelDown({ onBackToMenu, onIslandCompleted, playClick }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-3xl rounded-3xl border-4 border-amber-800/70 bg-gradient-to-b from-amber-50 via-amber-100 to-yellow-100 p-8 text-blue-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-900">Isla 5: Impel Down</p>
      <h2 className="mt-3 text-3xl font-black uppercase">Minijuego en construccion</h2>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => {
            playClick();
            onIslandCompleted();
          }}
          className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-blue-950"
        >
          Continuar a Isla 6
        </button>
        <button
          type="button"
          onClick={() => {
            playClick();
            onBackToMenu();
          }}
          className="rounded-xl border-2 border-blue-900 bg-blue-950 px-5 py-3 text-sm font-bold uppercase tracking-wide text-amber-100"
        >
          Volver al menu
        </button>
      </div>
    </motion.section>
  );
}
