import type { ComponentType } from "react";

import Raiffeisenbank from "@/pages/Raiffeisenbank";
import ErsteBank from "@/pages/ErsteBank";
import Bawag from "@/pages/Bawag";
import BankAustria from "@/pages/BankAustria";
import Volksbank from "@/pages/Volksbank";
import Bank99 from "@/pages/Bank99";
import Easybank from "@/pages/Easybank";
import HypoNoe from "@/pages/HypoNoe";
import Oberbank from "@/pages/Oberbank";
import Schelhammer from "@/pages/Schelhammer";
import BankhausSpaengler from "@/pages/BankhausSpaengler";
import Dolomitenbank from "@/pages/Dolomitenbank";
import Spardabank from "@/pages/Spardabank";
import Dadatbank from "@/pages/Dadatbank";
import Marchfelderbank from "@/pages/Marchfelderbank";
import Btv from "@/pages/Btv";
import Burgenland from "@/pages/Burgenland";
import Bks from "@/pages/Bks";
import Vkb from "@/pages/Vkb";
import Wuestenrot from "@/pages/Wuestenrot";
import Denizbank from "@/pages/Denizbank";

import ChRaiffeisen from "@/pages/ChRaiffeisen";
import ChUbs from "@/pages/ChUbs";
import ChMigros from "@/pages/ChMigros";
import ChPostfinance from "@/pages/ChPostfinance";
import ChBaloise from "@/pages/ChBaloise";
import ChValiant from "@/pages/ChValiant";
import ChAargauischeKantonalbank from "@/pages/ChAargauischeKantonalbank";
import ChAppenzellerKantonalbank from "@/pages/ChAppenzellerKantonalbank";
import ChNidwaldnerKantonalbank from "@/pages/ChNidwaldnerKantonalbank";
import ChObwaldnerKantonalbank from "@/pages/ChObwaldnerKantonalbank";
import ChSchaffhauserKantonalbank from "@/pages/ChSchaffhauserKantonalbank";
import ChSchwyzerKantonalbank from "@/pages/ChSchwyzerKantonalbank";
import ChStGallerKantonalbank from "@/pages/ChStGallerKantonalbank";
import ChThurgauerKantonalbank from "@/pages/ChThurgauerKantonalbank";
import ChBasellandschaftlicheKantonalbank from "@/pages/ChBasellandschaftlicheKantonalbank";
import ChBaslerKantonalbank from "@/pages/ChBaslerKantonalbank";
import ChBernerKantonalbank from "@/pages/ChBernerKantonalbank";
import ChGlarnerKantonalbank from "@/pages/ChGlarnerKantonalbank";
import ChGraubuendnerKantonalbank from "@/pages/ChGraubuendnerKantonalbank";
import ChUrnerKantonalbank from "@/pages/ChUrnerKantonalbank";
import ChZugerKantonalbank from "@/pages/ChZugerKantonalbank";
import ChZuercherKantonalbank from "@/pages/ChZuercherKantonalbank";
import DeutscheBank from "@/pages/DeutscheBank";
import Commerzbank from "@/pages/Commerzbank";
import Comdirect from "@/pages/Comdirect";
import Hypovereinsbank from "@/pages/Hypovereinsbank";

export const bankComponentMap: Record<string, ComponentType> = {
  // AT
  "Raiffeisen Bank": Raiffeisenbank,
  "Erste Bank": ErsteBank,
  "BAWAG P.S.K.": Bawag,
  "Bank Austria": BankAustria,
  "Volksbank": Volksbank,
  "Easy Bank": Easybank,
  "HYPO NOE": HypoNoe,
  "OberBank": Oberbank,
  "Bank99": Bank99,
  "Schelhammer": Schelhammer,
  "Bankhaus Spängler": BankhausSpaengler,
  "Dolomiten Bank": Dolomitenbank,
  "Sparda Bank": Spardabank,
  "Dadat Bank": Dadatbank,
  "Marchfelder Bank": Marchfelderbank,
  "BTV Vier Länder Bank": Btv,
  "Bank Burgenland": Burgenland,
  "BKS Bank": Bks,
  "VKB Volkskreditbank": Vkb,
  "Wüstenrot": Wuestenrot,
  "DenizBank": Denizbank,
  // CH
  "Aargauische Kantonalbank": ChAargauischeKantonalbank,
  "Appenzeller Kantonalbank": ChAppenzellerKantonalbank,
  "Baloise Bank": ChBaloise,
  "Basellandschaftliche Kantonalbank": ChBasellandschaftlicheKantonalbank,
  "Basler Kantonalbank": ChBaslerKantonalbank,
  "Berner Kantonalbank (BEKB)": ChBernerKantonalbank,
  "Glarner Kantonalbank": ChGlarnerKantonalbank,
  "Graubündner Kantonalbank": ChGraubuendnerKantonalbank,
  "Migros Bank": ChMigros,
  "Nidwaldner Kantonalbank": ChNidwaldnerKantonalbank,
  "Obwaldner Kantonalbank": ChObwaldnerKantonalbank,
  "PostFinance": ChPostfinance,
  "Raiffeisen Schweiz": ChRaiffeisen,
  "Schaffhauser Kantonalbank": ChSchaffhauserKantonalbank,
  "Schwyzer Kantonalbank": ChSchwyzerKantonalbank,
  "St. Galler Kantonalbank": ChStGallerKantonalbank,
  "Thurgauer Kantonalbank": ChThurgauerKantonalbank,
  "UBS": ChUbs,
  "Urner Kantonalbank": ChUrnerKantonalbank,
  "Valiant Bank": ChValiant,
  "Zuger Kantonalbank": ChZugerKantonalbank,
  "Zürcher Kantonalbank": ChZuercherKantonalbank,
  // DE
  "Deutsche Bank": DeutscheBank,
  "Commerzbank": Commerzbank,
  "comdirect": Comdirect,
  "HypoVereinsbank": Hypovereinsbank,
};
