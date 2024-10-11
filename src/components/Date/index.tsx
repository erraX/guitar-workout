import dynamic from "next/dynamic";
import { Skeleton } from "@nextui-org/react";

const DateNoSSR = dynamic(() => import("./Date"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-3" />,
});

export function Date({ ...props }: React.ComponentProps<typeof DateNoSSR>) {
  return <DateNoSSR {...props} />;
}
