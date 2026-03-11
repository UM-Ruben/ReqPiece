import { motion } from "framer-motion";

export default function Isla6LaughTale({ onIslandCompleted, playClick }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-3xl rounded-3xl border-4 border-amber-800/70 bg-gradient-to-b from-amber-50 via-amber-100 to-yellow-100 p-8 text-blue-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-900">Isla 6: Laugh Tale</p>
      <h2 className="mt-3 text-3xl font-black uppercase">Final del viaje</h2>
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
