import fs from "fs";
import path from "path";
import RulesClient from "./RulesClient";

export default function RulesPage() {
  const filePath = path.join(process.cwd(), "data", "rules.json");
  let rulesData = null;
  
  try {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    rulesData = JSON.parse(fileContents);
  } catch (e) {
    rulesData = {
      generalRules: [],
      participationRules: [],
      sportsRules: []
    };
  }

  return <RulesClient rulesData={rulesData} />;
}
