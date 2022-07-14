import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
  ModalCloseButton,
  ChakraProvider,
  chakra,
  
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";

import { AddressInput, EtherInput } from "..";
import CreateModalSentOverlay from "./CreateModalSentOverlay";
import {  Input } from "antd";  //Button,

export default function CreateMultiSigModal({
  price,
  selectedChainId,
  mainnetProvider,
  address,
  tx,
  writeContracts,
  contractName,
  isCreateModalVisible,
  setIsCreateModalVisible,
}) {
  
  const [pendingCreate, setPendingCreate] = useState(false);
  const [txSent, setTxSent] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [projectID, setProjectID] = useState(); 
  const [contributionAmount, setContributionAmount] = useState(0); 
  
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
  };

  const resetState = () => {
    setPendingCreate(false);
    setTxSent(false);
    setTxError(false);
    setTxSuccess(false);
    setContributionAmount(0);
  };

  const handleSubmit = async () => {
    try {
      setPendingCreate(true);

      const data = await writeContracts.populateTransaction.pay(
        4279, //PROJECT_ID,
        parseEther(contributionAmount), //  _amount
        "0x000000000000000000000000000000000000EEEe", //
        address, // _beneficiary,
        0, //_minReturnedTokens,
        false, // _preferClaimedTokens,
        "",  //  String message
        0x00// _metadata
      ) 

      tx({
        to: "0x765A8b9a23F58Db6c8849315C04ACf32b2D55cF8",
        value:  parseEther(contributionAmount), 
        gasPrice: ethers.utils.hexlify(2000000000),
        gasLimit: ethers.utils.hexlify(3000000),
        data: data["data"]
        },
       
        update => {
          if (update && (update.error || update.reason)) {
            console.log("tx update error!");
            setPendingCreate(false);
            setTxError(true);
          }

          if (update && update.code) {
            setPendingCreate(false);
            setTxSent(false);
          }

          if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log("tx update confirmed!");
            setPendingCreate(false);
            setTxSuccess(true);
            setTimeout(() => {
              setIsCreateModalVisible(false);
              resetState();
            }, 2500);
          }
        },
      ).catch(err => {
        setPendingCreate(false);
        throw err;
      });

      setTxSent(true);
    } catch (e) {
      console.log("Transaction Loading Error: ", e);
    }

  };
  
  const { isOpen, onOpen, onClose} = useDisclosure();
  
  const Card = chakra('div', {
    baseStyle: {
      shadow: 'lg',
      rounded: 'lg',
      bg: 'black',
    },
  })
  
    return (
  

    <>
    <ChakraProvider>
      <Button size={["xl"]}  colorScheme="orange"  p={3}   onClick={onOpen}>  
      🏰 Contribute to BuildGuidl
     
      </Button>
      
      <Modal isCentered   isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent isCentered backgroundColor="black"  width="800px" height="600px" > 
          <ModalHeader  fontSize="20" textAlign="center" color={"orange"}>
          &nbsp;&nbsp; Support  🏰  BuidlGuidl 
          </ModalHeader>
          <ModalCloseButton color={"black"} />
          <ModalBody  textAlign="center" color={"gray"} margin="2px">
          Funding 🏰 BuidlGuidl is not an investment. <br></br>
          It's a way to support the project. <br></br>
          Any value or utility of the tokens you receive is determined by 🏰 BuidlGuidl.<br></br><br></br>

          
          All funding goes to BuidlGuidl builders!<br></br><br></br>
          <Card fontSize="20" color={"orange"}>Contribution Amount: {contributionAmount} ETH </Card>
            <Input
                onChange={e => {
                setContributionAmount(e.target.value);
                }}
            /> <br></br><br></br>

          Potential risks:<br></br>
          Some properties of the project's current funding cycle may indicate risk for contributors.<br></br><br></br>

          The project owner may reconfigure this funding cycle at any time, without notice.<br></br>
          Funding cycles can be reconfigured moments before a new cycle begins, without notifying contributors.
          
            
          {txSent && (
              <CreateModalSentOverlay
                txError={txError}
                txSuccess={txSuccess}
                pendingText="Transaction Pending"
                successText="Success! The Guidl Thanks You"
                errorText="Transaction Failed"
              />
            )}
            
          </ModalBody>

          <ModalFooter margin="1px">
            
            <Button
              colorScheme={"orange"}
              key="submit"
              onClick={handleSubmit}
              _loading={pendingCreate}
              
              
            >
              Pay
            </Button>
            <Button margin="1px" colorScheme={"yellow"} mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </ChakraProvider>
    </>
    
  );
}
