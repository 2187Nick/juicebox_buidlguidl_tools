import { useContractReader,  useUserProviderAndSigner } from "eth-hooks";
import { ethers, utils } from "ethers";
import { Link } from "react-router-dom";
import { Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd"; //  Button,
import {
  Container,
  Flex,
  Icon,
  Button,
  ButtonGroup,
  Image,
  Box,
  Stack,
  Heading,
  HStack,
  Select,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup
} from "@chakra-ui/react";
import { SyncOutlined } from "@ant-design/icons";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  getJBChainlinkV3PriceFeed,
  getJBController,
  getJBCurrencies,

  getJBDirectory,
  getJBFundingCycleStore,
  getJBOperatorStore,
  getJBProjects,
  getJBSingleTokenPaymentTerminalStore,
  getJBETHERC20ProjectPayerDeployer,
  getJBETHERC20SplitsPayerDeployer,
  getJBETHPaymentTerminal,
  getJBPrices,
  getJB3DayReconfigurationBufferBallot,
  getJB7DayReconfigurationBufferBallot,
  getJBTokenStore,
  getJBSplitsStore,
  //getJBToken
  

} from "juice-sdk";
import {SelectBuilders, FundBuilders, FundBuilders2} from "../components";
import Thermometer from "react-thermometer-chart";
import useJuiceboxBalance from "../hooks/useJuiceboxBalance";


function Home({ yourLocalBalance, readContracts, mainnetProvider,
  writeContracts,
  customContracts,
  //userSigner,
  tx,
  address,
  blockExplorer,
  contractConfig,
  //rinkebyProvider,
  tokenBalance,
  
  }) {

  const RPC_HOST = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  const provider = new JsonRpcProvider(RPC_HOST);
  const PROJECT_ID = 44;

  const RPC_HOST_rinkeby = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  const provider_rinkeby = new JsonRpcProvider(RPC_HOST_rinkeby);
  const PROJECT_ID_rinkeby = 4279;
  
  const [balance_Rinkeby, setBalance_Rinkeby] = useState(0)
  const [balance1, setBalance] = useState("...")
  const [totalSupply, setTotalSupply] = useState("...")
  //const [tokenBalance, setTokenBalance] = useState("...")
  const [thermBalance, setThermBalance] = useState(0.001)
  //const [address1, setAddress1] = useState(0x000000000000000000)

  /*useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]); */
  /*useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);  */


  useEffect(() => {
    async function getBalance() {
      if (PROJECT_ID) {
        const JBDirectory =  getJBDirectory(provider);
        
        //const terminals = await getJBDirectory(provider).terminalsOf(PROJECT_ID)
        const terminals = await JBDirectory.terminalsOf(PROJECT_ID)
        // This returns an address.  This address is needed to get the balance from getJBSingleTokenPaymentTerminalStore
        const primaryTerminal = terminals[0];
        console.log("primaryTerminal:", primaryTerminal)
        const JBSingleTokenPaymentTerminalStore = getJBSingleTokenPaymentTerminalStore(provider)
        const balance_eth = await JBSingleTokenPaymentTerminalStore.balanceOf(primaryTerminal, PROJECT_ID)
        console.log("JBSingleTokenPaymentTerminalStore.balance1:", parseFloat(formatEther(balance_eth)).toFixed(4))

        const JBTokenStore = getJBTokenStore(provider)

        //  Total token supply 
        const totalSupplyOf = await JBTokenStore.totalSupplyOf(PROJECT_ID);
        console.log("JBTokenStore.totalSupplyOf:", parseFloat(formatEther(totalSupplyOf)).toFixed(0))

        setBalance(parseFloat(formatEther(balance_eth)).toFixed(2))
        setThermBalance(parseFloat(formatEther(balance_eth)).toFixed(2))
        setTotalSupply(parseFloat(formatEther(totalSupplyOf)).toFixed(0))
        
      }
    }
    getBalance();   
    
  }, [PROJECT_ID]);   




        //const ethProjectId = await userSigner.getAddress();

        /*const terminals_rinkeby = await getJBDirectory(rinkebyProvider).terminalsOf(PROJECT_ID_rinkeby);
        const primaryTerminal_rinkeby = terminals_rinkeby[0];

        const balance_rinkeby = await getJBSingleTokenPaymentTerminalStore(
          rinkebyProvider
        ).balanceOf(primaryTerminal_rinkeby, PROJECT_ID_rinkeby);
        
       
        setBalance_Rinkeby(balance_rinkeby);   */
        /*setBalance(balance_eth);
      }
    }
    getBalance();
    
  }, [PROJECT_ID]);  // ,PROJECT_ID_rinkeby */

  /*async function getBalance() {

    const JBDirectory =  getJBDirectory(provider);
    //console.log("JBDirectory:", JBDirectory)
    
    //const terminals = await getJBDirectory(provider).terminalsOf(PROJECT_ID)
    const terminals = await JBDirectory.terminalsOf(PROJECT_ID)
    // This returns an address.  This address is needed to get the balance from getJBSingleTokenPaymentTerminalStore
    const primaryTerminal = terminals[0];
    console.log("primaryTerminal:", primaryTerminal)

   

    const JBSingleTokenPaymentTerminalStore = getJBSingleTokenPaymentTerminalStore(provider)
    const balance_eth = await JBSingleTokenPaymentTerminalStore.balanceOf(primaryTerminal, PROJECT_ID)
    console.log("JBSingleTokenPaymentTerminalStore.balance1:", parseFloat(formatEther(balance_eth)).toFixed(4))
  
    setBalance(parseFloat(formatEther(balance_eth)).toFixed(4))
  }
  getBalance(); */

  // <h4>Rinkeby Test Project: #{PROJECT_ID_rinkeby} live balance: {balance_Rinkeby}</h4><br></br><br></br>

  // BuidlGuild Project: #{PROJECT_ID} live balance: {balance} ETH<br></br><br></br>

  //Your BuidlGuidl project token balance {tokenBalance} <br></br><br></br>

  /*const { data: balance } = useJuiceboxBalance({ projectId: PROJECT_ID });
  const balanceETH = balance
    ? parseFloat(formatEther(balance)).toFixed(4)
    : "..."; */

   //balance = {balanceETH} Rinkeby ETH

   //  Dashboard: <br></br><br></br>
   /*
   <div style={{alignItem: "center", justifyContent:"center"}}>
        <Thermometer  width="200px" height="480px" steps={5} minValue={0} maxValue={50} currentValue={thermBalance}> 
        </Thermometer>
        </div>
      */

  return (

    <Container>

    <div style={{ margin: 30, textAlign: "left", fontSize: 20,   }}>

        <p style={{ margin: 30, textAlign: "center", fontSize: 20  }}>
         🏰 BuidlGuidl Project {PROJECT_ID} Juicebox balance: {balance1} ETH <br></br><br></br>
        </p> 

        <div style={{ margin: 30, textAlign: "center", fontSize: 20  }}>
        <FundBuilders2></FundBuilders2>
        </div>

    </div>
    </Container>
  );
}

export default Home;
