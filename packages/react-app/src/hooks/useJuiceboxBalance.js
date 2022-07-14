import { useEffect, useState } from "react";
import { JsonRpcProvider } from "@ethersproject/providers";

import {
  getJBDirectory,
  getJBSingleTokenPaymentTerminalStore,
} from "juice-sdk";

const RPC_HOST = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

//const RPC_HOST_rinkeby = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
//const RPC_HOST = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
  //"https://mainnet.infura.io/v3/YOUR_INFURA_ID";
  
export default function useJuiceboxBalance({ projectId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function getBalance(projectId) {
      const provider = new JsonRpcProvider(RPC_HOST);
      console.log("provider_Jb_Balance: ", provider)

      const terminals = await getJBDirectory(provider).terminalsOf(projectId);
      const primaryTerminal = terminals[0];
      console.log("pro_primaryTerminal: ", primaryTerminal)

      const balance = await getJBSingleTokenPaymentTerminalStore(
        provider
      ).balanceOf(primaryTerminal, projectId);
      console.log("pro_balance: ", balance)

      return balance;
    }

    setLoading(true);

    getBalance(projectId)
      .then((balance) => {
        setLoading(false);
        setData(balance);
      })
      .catch((e) => {
        setError(e);
      });
  }, [projectId]);

  return { loading, data, error };
} 