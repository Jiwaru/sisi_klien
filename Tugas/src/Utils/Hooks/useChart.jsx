import { useQuery } from "@tanstack/react-query";
import { getChartData } from "@/Utils/Apis/ChartApi";

export const useChartData = () =>
  useQuery({
    queryKey: ["chart-data"],
    queryFn: getChartData,
    select: (res) => res.data,
  });
