"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const ContainerScroll = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const containerRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const scaleDimensions = () => {
        return isMobile ? [0.7, 0.9] : [1.05, 1];
    };

    const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div
            className="h-[60rem] md:h-[80rem] flex items-start md:items-center justify-center relative p-2 pt-40 md:p-20"
            ref={containerRef}
            suppressHydrationWarning={true}
        >
            <div
                className="py-10 w-full relative"
                style={{
                    perspective: "1000px",
                }}
            >
                <Header translate={translate} />
                <Card rotate={rotate} translate={translate} scale={scale}>
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate }: { translate: any }) => {
    return (
        <motion.div
            style={{
                translateY: translate,
            }}
            className="max-w-5xl mx-auto text-center"
        >
            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-8">
                Şehrin Ritmini <br />
                <span className="text-5xl md:text-[6rem] font-bold mt-1 leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                    Panobu İle Yakala
                </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                Markanızı şehrin en işlek noktalarındaki billboardlarda dakikalar içinde yayınlayın.
                Sabit fiyatlar, direkt pano sahibinden, aracısız kiralama.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-black hover:bg-slate-200 rounded-full transition-all hover:scale-105">
                    <Link href="/auth/register">
                        Kampanya Oluştur <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </Button>
                <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg border border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full backdrop-blur-sm">
                    <Link href="https://calendly.com/erendoru/30dk" target="_blank">
                        Demo Talep Et
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
};

export const Card = ({
    rotate,
    scale,
    translate,
    children,
}: {
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    translate: MotionValue<number>;
    children: React.ReactNode;
}) => {
    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
            }}
            className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
        >
            <div className="h-full w-full rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl relative">
                {children}
            </div>
        </motion.div>
    );
};
