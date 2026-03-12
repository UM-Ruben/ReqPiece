import { motion } from "framer-motion";
import { BookOpen, Compass, Scroll, Swords } from "lucide-react";
import PropTypes from "prop-types";

export default function IslandIntro({ islandKey, onStart, playClick }) {
  const intros = {
    isla1: {
      title: 'LA CIUDAD DEL PRINCIPIO Y EL FIN',
      subtitle: 'LOGUETOWN',
      description: [
        'Loguetown, donde el Rey de los Piratas exhaló su último aliento y proclamó la existencia del One Piece. Aquí, en esta plaza legendaria, todo proyecto comienza con una visión. Tu cliente ha pronunciado sus deseos, pero como todo gran capitán, debes trazar tu ruta antes de zarpar.',
        'El primer paso hacia el One Spec es comprender el verdadero alcance de tu misión: ordenar las fases del ciclo de vida del SRS. Sin un Log Pose que marque el camino correcto, tu barco jamás saldrá del East Blue.'
      ],
      cta: '¡ZARPAR HACIA LA GRAN LÍNEA!',
    },
    isla2: {
      title: 'LOS MAESTROS CARPINTEROS DE GALLEY-LA',
      subtitle: 'WATER 7',
      description: [
        'Water 7, la ciudad flotante donde los mejores carpinteros del mundo construyen barcos que desafían los mares más peligrosos. Iceburg y su equipo de Galley-La no entienden de sueños: hablan de maderas, remaches, quillas y velas.',
        'Tu cliente te ha dicho "quiero un barco que llegue a Laugh Tale", pero los carpinteros necesitan especificaciones técnicas precisas. Debes traducir esos anhelos en requisitos no funcionales: rendimiento, resistencia, seguridad. Aquí aprenderás a hablar el idioma de los constructores, porque un barco mal diseñado se hunde antes de ver la primera tormenta.'
      ],
      cta: '¡ENTREGAR LOS PLANOS A GALLEY-LA!',
    },
    isla3: {
      title: 'EL ENCUENTRO DE LAS SUPERNOVAS',
      subtitle: 'ARCHIPIÉLAGO SABAODY',
      description: [
        'Sabaody, el caótico punto de encuentro donde once Supernovas convergen antes del Nuevo Mundo. Cada capitán tiene su propia ambición, su propia visión, sus propias exigencias. En el desarrollo de software, rara vez trabajas con un solo stakeholder: la Marina quiere seguridad, los piratas quieren libertad, los civiles quieren protección.',
        'Debes dominar el arte de la priorización (MoSCoW) y distinguir entre lo que el usuario QUIERE (el requisito) y CÓMO lo conseguirá (la solución técnica). Fallar aquí significa que un Almirante destruya todo tu trabajo.'
      ],
      cta: '¡ENFRENTAR EL CAOS DE SABAODY!',
    },
    isla4: {
      title: 'LA IRA DE BIG MOM',
      subtitle: 'WHOLE CAKE ISLAND',
      description: [
        'Whole Cake Island, el territorio de un Yonko cuyo hambre insaciable puede destruir naciones enteras. Big Mom ha ordenado un pastel de boda perfecto, pero sus exigencias cambian cada segundo: más dulce, más grande, diferente sabor. Este es el infierno de los requisitos volátiles.',
        'En el mundo real, los clientes son como Yonkos: poderosos, impredecibles y capaces de aniquilar tu proyecto si no entregas EXACTAMENTE lo que pidieron. Aquí aprenderás a clasificar requisitos funcionales y no funcionales antes de que el grito de "WEDDING CAAAKE!" destruya tu SRS.'
      ],
      cta: '¡SOBREVIVIR AL BANQUETE DEL TERROR!',
    },
    isla5: {
      title: 'LA FORTALEZA DE ONIGASHIMA',
      subtitle: 'WANO KUNI',
      description: [
        'Wano Kuni, un país aislado bajo la tiranía de Kaido, la criatura más fuerte del mundo. Para derrocar un sistema legacy tan arraigado, necesitas más que fuerza bruta: necesitas precisión técnica. Cada requisito debe ser verificable, no ambiguo, completo, consistente y trazable (IEEE 830).',
        'En Onigashima, el castillo flotante de Kaido, validarás tus requisitos bajo fuego enemigo. Un solo error en la especificación y la alianza Ninja-Pirata-Mink-Samurái fracasará. Aquí, la trazabilidad es tu katana y la validación es tu técnica Haki.'
      ],
      cta: '¡ASALTAR ONIGASHIMA!',
    },
    isla6: {
      title: 'EL LABORATORIO DEL FUTURO CORROMPIDO',
      subtitle: 'EGGHEAD',
      description: [
        'Egghead, la isla del futuro donde la tecnología de Vegapunk trasciende la imaginación humana. Pero en esta línea temporal, el genio científico ha sido corrompido y sus creaciones te esperan con cambios de requisitos, impactos cruzados y documentación viva.',
        'Aquí no ganarás por adivinar. Tendrás que leer un requisito, pensar qué artefactos del sistema se ven afectados y registrar la traza correcta. Esa es justamente la idea detrás de herramientas como IBM DOORS o muchas herramientas CASE/CARE: mantener la relación entre requisitos, diseño, pruebas, código y datos cuando el sistema cambia.'
      ],
      cta: '¡HACKEAR EL LABORATORIO!',
    },
    isla7: {
      title: 'EL TESORO FINAL: EL ONE SPEC',
      subtitle: 'LAUGH TALE',
      description: [
        'Laugh Tale, la isla que solo los verdaderos maestros pueden encontrar. Después de atravesar el Grand Line completo, dominando cada aspecto de la Ingeniería de Requisitos, finalmente llegas al lugar donde Gold Roger dejó su legado. Aquí no hay enemigos, no hay trampas: solo la validación final.',
        '¿Has construido el SRS perfecto? ¿Cada requisito está trazado, verificado, priorizado y validado? Si es así, reclamarás el One Spec: el Documento de Especificación de Requisitos de Software que se convertirá en leyenda. Tu nombre será cantado como el nuevo Rey de los Analistas.'
      ],
      cta: '¡RECLAMAR EL ONE SPEC!',
    },
  };

  const intro = intros[islandKey];

  if (!intro) return null;

  const handleStart = () => {
    if (playClick) playClick();
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-5xl rounded-3xl border-4 border-amber-700/80 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-8 text-blue-950 shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:p-12"
    >
      {/* Header con icono decorativo */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <Scroll className="h-8 w-8 text-amber-700" />
        <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-amber-700">
          Introducción a la isla
        </p>
        <Scroll className="h-8 w-8 text-amber-700" />
      </div>

      {/* Subtítulo */}
      <p className="mb-2 text-center text-sm font-bold uppercase tracking-[0.2em] text-blue-800/70">
        {intro.subtitle}
      </p>

      {/* Título principal */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-8 text-center text-3xl font-black uppercase leading-tight tracking-wide text-blue-950 md:text-4xl lg:text-5xl"
      >
        {intro.title}
      </motion.h1>

      {/* Separador decorativo */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-amber-600" />
        <Swords className="h-6 w-6 text-amber-600" />
        <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-amber-600" />
      </div>

      {/* Descripción narrativa */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mx-auto mb-10 max-w-3xl space-y-4"
      >
        {intro.description.map((paragraph, index) => (
          <p
            key={index}
            className="text-center text-base font-semibold leading-relaxed text-blue-900/90 md:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </motion.div>

      {islandKey === "isla6" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mb-10 max-w-4xl rounded-2xl border-4 border-cyan-700/50 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-6 text-cyan-100 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-cyan-300" />
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">Bitácora de Vegapunk</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-cyan-300">Cómo se juega</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-cyan-50/90">
                Selecciona un requisito, lee su objetivo y después inspecciona los artefactos del sistema. Solo debes enlazar los que realmente cambiarían si ese requisito se modifica.
              </p>
            </div>

            <div className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-fuchsia-300">Qué representa</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-cyan-50/90">
                Igual que en DOORS o en herramientas CASE/CARE, aquí practicas trazabilidad e impacto del cambio: requisito, artefacto afectado y evidencia de que la relación existe.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-center"
      >
        <button
          type="button"
          onClick={handleStart}
          className="group inline-flex items-center gap-3 rounded-xl border-4 border-amber-600 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 px-8 py-4 text-lg font-black uppercase tracking-[0.15em] text-blue-950 shadow-[0_8px_20px_rgba(217,119,6,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(217,119,6,0.6)] active:translate-y-0"
        >
          <Compass className="h-6 w-6 transition-transform group-hover:rotate-12" />
          {intro.cta}
          <Compass className="h-6 w-6 transition-transform group-hover:-rotate-12" />
        </button>
      </motion.div>

      {/* Decoración inferior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-amber-700/60"
      >
        ⚔ Prepárate para el desafío ⚔
      </motion.div>
    </motion.div>
  );
}

IslandIntro.propTypes = {
  islandKey: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
  playClick: PropTypes.func,
};
