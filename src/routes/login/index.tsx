

import { LoginForm } from "@/components/login-form"
import { createFileRoute } from "@tanstack/react-router"
import "./index.css"
import { Button } from "@/components/ui/button"
import {useLottie} from "lottie-react";
import sprinter from "@/assets/lottie/sprinter.json";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})


export default function LoginPage() {
  
  const runner = useRef<HTMLDivElement | null>(null);

  const sprinterOne = {
    animationData: sprinter,
    initialSegment: [0, 15] as [number, number],
    loop: true
  };

  const sprinterTwo = {
    animationData: sprinter,
    initialSegment: [17, 56] as [number, number],
    loop: true
  };

  const { View:SprinterOneView } = useLottie(sprinterOne);
  const { View:SprinterTwoView } = useLottie(sprinterTwo);

  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    gsap.to(runner.current, { x: "-130vw", duration: 10, repeat: -1, ease: "linear", delay: 5, repeatDelay: 10 }); 
  }
  , [runner]);


  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 login-page">
      <div className="w-full max-w-md z-30">
        <LoginForm />
      </div>
      <Button variant="secondary" className="!fixed right-6 bottom-6 z-20">Enter as spectator</Button>
      <div className="sprinter fixed -left-12 bottom-6 h-96 w-96 z-20">
        <>{SprinterOneView}</>
      </div>
      <div ref={runner} className="sprinter-two fixed -right-96 bottom-9 h-96 w-96 z-10 scale-x-[-1]">
        <>{SprinterTwoView}</>
      </div>
    </div>
  )
}
