"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type HeroScrollCopy = {
    h1Line1: string;
    h1Line2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
};

export const ContainerScroll = ({
    children,
    hero,
}: {
    children: React.ReactNode;
    hero: HeroScrollCopy;
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
            className="h-[55rem] md:h-[80rem] flex items-start md:items-center justify-center relative p-2 pt-40 md:p-20 overflow-hidden"
            ref={containerRef}
            suppressHydrationWarning={true}
        >
            <div
                className="py-10 w-full relative"
                style={{
                    perspective: "1000px",
                }}
            >
                <Header translate={translate} hero={hero} />
                <Card rotate={rotate} translate={translate} scale={scale}>
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate, hero }: { translate: any; hero: HeroScrollCopy }) => {
    return (
        <motion.div
            style={{
                translateY: translate,
            }}
            className="max-w-5xl mx-auto text-center"
        >
            <h1 className="text-4xl md:text-6xl font-semibold text-neutral-900 mb-4 md:mb-6 leading-tight">
                {hero.h1Line1}
                <br />
                <span className="text-5xl md:text-[5.5rem] font-bold mt-2 md:mt-3 block leading-[1.1] text-[#11b981]">
                    {hero.h1Line2}
                </span>
            </h1>
            <p className="text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                {hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-[#11b981] text-white hover:bg-[#0ea472] rounded-full transition-all hover:scale-105 shadow-md shadow-[#11b981]/25">
                    <Link href="/static-billboards">
                        {hero.ctaPrimary} <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </Button>
                <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 text-lg border-2 border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 hover:border-[#11b981] rounded-full transition-all"
                >
                    <Link href="/static-billboards">
                        {hero.ctaSecondary} <ArrowRight className="w-5 h-5 ml-2" />
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
            className="max-w-5xl -mt-12 mx-auto h-[22rem] md:h-[40rem] w-full p-2 md:p-6 bg-[#1a2332] rounded-[30px] shadow-2xl"
        >
            <div className="h-full w-full rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl relative">
                {children}
            </div>
        </motion.div>
    );
};
