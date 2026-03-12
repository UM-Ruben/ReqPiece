import { motion } from "framer-motion";

export default function Isla7LaughTale({ onBackToMenu, onIslandCompleted, playClick }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-3xl rounded-3xl border-4 border-amber-800/70 bg-gradient-to-b from-amber-50 via-amber-100 to-yellow-100 p-8 text-blue-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-900">Isla 7: Laugh Tale</p>
          <h2 className="mt-3 text-3xl font-black uppercase">Final del viaje</h2>
        </div>

        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg border border-amber-500/60 bg-amber-200/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-950 transition hover:bg-amber-200/40"
        >
          Volver al menú
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => {
            playClick();
            onIslandCompleted();
          }}
          className="rounded-xl border-2 border-amber-400 bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-blue-950"
        >
          Siguiente isla
        </button>
      </div>
    </motion.section>
  );
}
