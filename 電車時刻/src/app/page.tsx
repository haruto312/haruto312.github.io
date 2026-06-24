import { NearbyDeparturesApp } from "@/components/NearbyDeparturesApp";

export default function Home() {
  return <NearbyDeparturesApp bootedAt={new Date().toISOString()} />;
}
