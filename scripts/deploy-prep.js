const fs = require("fs");
const yaml = require("js-yaml");

const config = {
  goerli: {
    v1FactoryAddress: "",
    v1FactoryStartBlock: "",
    v2FactoryAddress: "",
    v2FactoryStartBlock: "",
    v21FactoryAddress: "0x72B8Bf40C8B316753a3E470689DA625759D2b025",
    v21FactoryStartBlock: 7103207,
  },
  xdai: {
    v1FactoryAddress: "0x9232DeA84E91b49feF6b604EEA0455692FC27Ba8",
    v1FactoryStartBlock: 10733005,
    v2FactoryAddress: "0x124F707B3675b5fdd6208F4483C5B6a0B9bAf316",
    v2FactoryStartBlock: 10733005,
    v21FactoryAddress: "0x0F50B2F3165db96614fbB6E4262716acc9F9e098",
    v21FactoryStartBlock: 13569775,
  },
  mainnet: {
    v1FactoryAddress: "0x2840d12d926cc686217bb42b80b662c7d72ee787",
    v1FactoryStartBlock: 8625240,
    v2FactoryAddress: "0x1782a13f176e84Be200842Ade79daAA0B09F0418",
    v2FactoryStartBlock: 9484660,
    v21FactoryAddress: "0x38064F40B20347d58b326E767791A6f79cdEddCe",
    v21FactoryStartBlock: 11499150,
  },
  matic: {
    v1FactoryAddress: "",
    v1FactoryStartBlock: "",
    v2FactoryAddress: "",
    v2FactoryStartBlock: "",
    v21FactoryAddress: "0x6690C139564144b27ebABA71F9126611a23A31C9",
    v21FactoryStartBlock: 10397177,
  },
  "arbitrum-one": {
    v1FactoryAddress: "",
    v1FactoryStartBlock: "",
    v2FactoryAddress: "",
    v2FactoryStartBlock: "",
    v21FactoryAddress: "0x9232DeA84E91b49feF6b604EEA0455692FC27Ba8",
    v21FactoryStartBlock: 219866,
  },
  "kovan-optimism": {
    v1FactoryAddress: "",
    v1FactoryStartBlock: "",
    v2FactoryAddress: "",
    v2FactoryStartBlock: "",
    v21FactoryAddress: "0x72B8Bf40C8B316753a3E470689DA625759D2b025",
    v21FactoryStartBlock: 1710095,
  },
  optimism: {
    v1FactoryAddress: "",
    v1FactoryStartBlock: "",
    v2FactoryAddress: "",
    v2FactoryStartBlock: "",
    v21FactoryAddress: "0x032865ACfc05E769902Fe90Bcc9d511875a74E66",
    v21FactoryStartBlock: 4864699,
  },
  celo: {
    v1FactoryAddress: "",
    v1FactoryStartBlock: "",
    v2FactoryAddress: "",
    v2FactoryStartBlock: "",
    v21FactoryAddress: "0x8c47bD2ABae16323054a19aA562efC87A6c26d29",
    v21FactoryStartBlock: 8691191,
  },
};

const network = process.argv.slice(2)[0];

try {
  let fileContents = fs.readFileSync("./subgraph-template.yaml", "utf8");
  let data = yaml.safeLoad(fileContents);

  data.dataSources[0].network = network;
  data.dataSources[0].source.address = config[network].v1FactoryAddress;
  data.dataSources[0].source.startBlock = config[network].v1FactoryStartBlock;

  data.dataSources[1].network = network;
  data.dataSources[1].source.address = config[network].v2FactoryAddress;
  data.dataSources[1].source.startBlock = config[network].v2FactoryStartBlock;

  data.dataSources[2].network = network;
  data.dataSources[2].source.address = config[network].v21FactoryAddress;
  data.dataSources[2].source.startBlock = config[network].v21FactoryStartBlock;

  data.templates[0].network = network;
  data.templates[1].network = network;
  data.templates[2].network = network;

  if (network !== "mainnet") {
    data.dataSources.splice(3, 1);
  }

  // TODO potentially something here
  if (
    network === "matic" ||
    network === "arbitrum-one" ||
    network === "celo" ||
    network === "optimism" ||
    network === "kovan-optimism"
  ) {
    data.dataSources.splice(0, 2);
    data.templates.splice(0, 2);
  }

  let yamlStr = yaml.safeDump(data);
  fs.writeFileSync("subgraph.yaml", yamlStr, "utf8");

  console.log("Generated subgraph.yaml for " + network);
} catch (e) {
  console.log(e);
}
