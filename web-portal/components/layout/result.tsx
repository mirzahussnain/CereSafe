'use client'
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { getRefinedFeatures, RiskColorCard, RiskColorTag } from "@/lib/data";
import { PredictionResultType } from "@/lib/types";

export default function Result({predictionResult}:{predictionResult:PredictionResultType}){
    return(
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`w-[350px] md:w-full md:max-w-3xl  rounded-3xl  flex justify-between items-center
            bg-conic/[from_var(--border-angle)] my-5  p-1 animate-rotate-border ${RiskColorCard(predictionResult.risk_level)}`}
        >
          <Card className='w-screen rounded-3xl'>
           
            <CardContent className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className='px-2 flex :justify-start items-center md:items-start flex-col'>
                <h3 className={`text-xl font-bold w-fit px-2 tracking-wide text-muted-foreground`}>Risk Level</h3>
                <p className={`text-lg font-medium capitalize text-center w-fit mt-2 ml-2  px-2 border-2 rounded-xl tracking-wider shadow-md
                  ${RiskColorTag(predictionResult.risk_level)}`}>{predictionResult.risk_level}</p>
              </div>
              <div className='px-2 mx-auto'>
                <h3 className="text-xl font-bold w-fit px-2 tracking-wide text-muted-foreground">Stroke Chance</h3>
                <p className="text-xl font-medium mt-0.5 p-1 text-center">{parseFloat(predictionResult.probability.toFixed(2))*100}%</p>
              </div>
              {predictionResult.factors.length > 0 && (
                <div className="col-span-full px-2">
                  <h3 className="text-center w-full text-xl font-bold md:w-fit px-2 tracking-wide text-muted-foreground">Key Risk Factors</h3>
                  <p className='w-full text-center md:text-start font-semibold text-muted-foreground/60 ml-2'>Following factors contributed to your stroke risk assessment:</p>
                  <ul className="px-3 flex flex-col  gap-2 my-3">
                    {predictionResult.factors.map((factor, index) => (
                      <li key={index} className="md:grid grid-cols-2 gap-2 text-sm flex flex-col items-center">
                        <span className="col-span-2 text-secondary-foreground font-semibold bg-overlay-2/80 w-fit h-fit rounded-lg px-2 py-1 tracking-wide">{factor.feature}</span>
                        <p className=" col-span-2 text-[13px] w-full md:text-[15px] text-primary/60 font-medium text-center md:text-justify">{getRefinedFeatures([factor])[0]}</p>

                      </li>
                      
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
    )
}