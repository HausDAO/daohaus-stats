import { BigInt, Address } from "@graphprotocol/graph-ts";
import { MolochV22Template } from "../generated/templates";
import { SummonComplete } from "../generated/V22Factory/V22Factory";
import { Moloch, DaoMeta } from "../generated/schema";

import { addGas } from "./badges";
import { addBalance } from "./v2-mapping";

export function handleSummonV22(event: SummonComplete): void {
  MolochV22Template.create(event.params.moloch);

  let molochId = event.params.moloch.toHexString();
  let moloch = new Moloch(molochId);
  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.version = "2.1";
  daoMeta.newContract = "1";
  daoMeta.save();

  let creator: Address = event.params._summoner;
  moloch.summoner = creator;

  moloch.timestamp = event.block.timestamp.toString();
  moloch.summoningTime = event.params.summoningTime;
  moloch.version = "2.2";
  moloch.deleted = false;
  moloch.newContract = "1";
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.memberCount = BigInt.fromI32(1);
  moloch.voteCount = BigInt.fromI32(0);
  moloch.rageQuitCount = BigInt.fromI32(0);
  moloch.totalGas = addGas(BigInt.fromI32(0), event.transaction);

  moloch.save();

  let eventTokens: Address[] = event.params.tokens;
  let depoistToken: Address = eventTokens[0];
  addBalance(
    event.params.moloch,
    moloch.summoner.toHex(),
    event.block,
    event.transaction,
    BigInt.fromI32(0),
    depoistToken,
    "initial",
    "summon"
  );
}
