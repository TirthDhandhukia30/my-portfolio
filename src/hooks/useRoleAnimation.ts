import { useState, useEffect, useCallback, useRef } from 'react';

const ROLES = ['DSA Enthusiast', 'Web Developer', 'AI Explorer'];
const ROLE_EXIT_DURATION = 350;
const ROLE_CYCLE_DURATION = 4200;

export function useRoleAnimation() {
  const [currentRole, setCurrentRole] = useState(ROLES[0]);
  const [animationClass, setAnimationClass] = useState('role-enter');
  const roleIndexRef = useRef(0);
  const isLockedRef = useRef(false);

  const cycleRole = useCallback(() => {
    if (isLockedRef.current) return;

    isLockedRef.current = true;
    setAnimationClass('role-exit');

    setTimeout(() => {
      roleIndexRef.current = (roleIndexRef.current + 1) % ROLES.length;
      setCurrentRole(ROLES[roleIndexRef.current]);
      setAnimationClass('role-enter');
      isLockedRef.current = false;
    }, ROLE_EXIT_DURATION);
  }, []);

  useEffect(() => {
    const interval = setInterval(cycleRole, ROLE_CYCLE_DURATION);
    return () => clearInterval(interval);
  }, [cycleRole]);

  return { currentRole, animationClass };
}
