"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownIcon,
} from "lucide-react";
import { motion } from "framer-motion";


export default function Timeline({data}:{data:any}) {
  return (
    <div className="relative mt-10 px-2">
      {/* Center vertical line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/50 z-0" />

      <div className="space-y-16">
        {data.map((item:any, index:number) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-center md:items-start w-full ${
                isLeft && "md:flex-row-reverse"
              }`}
            >
              {/* Spacer for alignment */}
              <div className="hidden md:block md:w-5/12" />

              {/* Icon & number */}
              <div className="z-10 flex flex-col items-center">
                <div className="relative w-12 h-12 rounded-full bg-primary text-white shadow-md flex items-center justify-center font-bold">
                  {item.icon}
                  <span className="block md:hidden absolute -top-16 text-xs font-medium">
                    {index!==0&&<ArrowDownIcon className="h-7 w-4 text-zinc-400/80"/>}
                  </span>
                </div>
              </div>

              {/* Card */}
              <div className="mt-6 md:mt-0 md:w-8/12 w-full px-4">
                <Card className="bg-muted shadow-md">
                  <CardContent className="py-4 px-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <Badge variant="secondary">{item.badge}</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
