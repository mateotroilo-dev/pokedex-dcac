import { useEffect, useRef } from 'react';

const useIntersectionObserver = ({ onIntersect, enabled, rootMargin }) => {
  const targetRef = useRef(null);
  // En un ref para que una funcion inline nueva por render no fuerce recrear el observer.
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return undefined;

    const node = targetRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current();
      },
      { rootMargin },
    );

    // Si el nodo ya esta en viewport, observe() dispara el callback de una: es lo que encadena la
    // pagina siguiente cuando el sentinel nunca llego a salir de pantalla.
    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
};

export { useIntersectionObserver };
