import { OrderStatus } from "@/types";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const statuses: OrderStatus[] = ["Não iniciado", "Em andamento", "Aguardando busca", "Finalizado"];

export const OrderTimeline = ({ currentStatus }: OrderTimelineProps) => {
  const currentIndex = statuses.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelado";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <XCircle className="h-5 w-5 text-destructive" />
        <span className="font-medium text-destructive">Pedido Cancelado</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {statuses.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={status} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center w-full">
                {index > 0 && (
                  <div
                    className={`absolute right-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
                <div className="relative z-10 flex items-center justify-center">
                  {isCompleted && (
                    <CheckCircle2 className="h-8 w-8 text-primary fill-primary/20" />
                  )}
                  {isCurrent && (
                    <div className="h-8 w-8 rounded-full border-4 border-primary bg-background" />
                  )}
                  {isUpcoming && (
                    <Circle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                {index < statuses.length - 1 && (
                  <div
                    className={`absolute left-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center font-medium ${
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
