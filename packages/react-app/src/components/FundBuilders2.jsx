import {
    Button,
    Stack,
    HStack,
    Checkbox,
    ChakraProvider,
    chakra,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    ModalBody,
    Modal,
    ModalCloseButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";

import abi from "../contracts/ABI/single";
import controller_abi from "../contracts/ABI/controller";

import React,{ useEffect, useState } from "react";
import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { AddressInput, EtherInput } from "..";
import CreateModalSentOverlay from "./CreateModalSentOverlay";
import { JsonRpcProvider } from "@ethersproject/providers";


export default function FundBuilders2({
  price,
  selectedChainId,
  mainnetProvider,
  address,
  tx,
  writeContracts,
  readRinkebyContracts,
  contractName,
  isCreateModalVisible,
  setIsCreateModalVisible,
}) {
  const [checkedItems, setCheckedItems] = useState([false, false, false])

  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  const [pendingCreate, setPendingCreate] = useState(false);
  const [txSent, setTxSent] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  //const [projectID, setProjectID] = useState(); 
  const [contributionAmount, setContributionAmount] = useState(0); 
  const [value, setValue] = useState([0.001, 0.001, 0.001]);

  const [payValue, setPayValue] = useState(0);
  const [payValue1, setPayValue1] = useState(0);
  const [payValue2, setPayValue2] = useState(0);
  const [availableOverflow, setAvailableOverflow] = useState("...");

  
  const RPC_HOST_rinkeby = "https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad";
  const provider = new JsonRpcProvider(RPC_HOST_rinkeby);

  const primaryTerminal = "0x765A8b9a23F58Db6c8849315C04ACf32b2D55cF8";
  const PROJECT_ID = 4325;
  const configuration = 1657753060;  
  const contractABI = abi;
  const controller_contractABI = controller_abi;
  const contractAddress = "0x5d4eb71749DD9984118EBdF96aaF3CF6EAE1A745"; 
  const controller_contractAddress = "0xd96ecf0E07eB197587Ad4A897933f78A00B21c9a"

  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const controller_contract = new ethers.Contract(controller_contractAddress, controller_contractABI, provider);


  useEffect(() => {
    async function getBalance() {
      
        if (PROJECT_ID) {

            const allowance_used = await contract.usedOverflowAllowanceOf(
                primaryTerminal,
                PROJECT_ID,
                configuration  
                )
            console.log("allowanceUsed:", parseFloat(formatEther(allowance_used)).toFixed(4))

            const currentOverflowOf = await contract.currentOverflowOf(
                primaryTerminal,
                PROJECT_ID
                )
            console.log("currentOverflowOf:", parseFloat(formatEther(currentOverflowOf)).toFixed(4))
            const currentOverflowOf_parsed =  parseFloat(formatEther(currentOverflowOf)).toFixed(4);

            const overflowAllowanceOf = await controller_contract.overflowAllowanceOf(
                PROJECT_ID,
                configuration,
                primaryTerminal,
                "0x000000000000000000000000000000000000EEEe"
                )
            console.log("overflowAllowanceOf:",  parseFloat(formatEther(overflowAllowanceOf[0])).toFixed(4))
            
            const unusedAllowance = parseFloat(formatEther(overflowAllowanceOf[0])).toFixed(4) -  parseFloat(formatEther(allowance_used)).toFixed(4);
            console.log("unusedAllowance:", unusedAllowance)

            if(currentOverflowOf  && unusedAllowance ) {
                if(currentOverflowOf_parsed > unusedAllowance ){
                  setAvailableOverflow(unusedAllowance)
                }
                else{
                    setAvailableOverflow(currentOverflowOf_parsed)  
                }
                

            }
            
            
        }
      }
        getBalance();
        console.log("availableAllowance: ", availableOverflow)   
    
  }, [PROJECT_ID]);  
  

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
    
      const data = await writeContracts.populateTransaction.useAllowanceOf(
        4325,   //4279  //PROJECT_ID,
        //parseEther("0.0001"), //  _amount
        parseEther(payValue.toString()), //  _amount
        1, // _currency, address _token, uint256 _minReturnedTokens, string _memo
        "0x000000000000000000000000000000000000EEEe", // _token
        0, //_minReturnedTokens,
        "0xef3A8D0a15755D024D514b984bec87d59638f1D1", // _beneficiary,
        "YO"  // _memo
        
        )  

      const data1 = await writeContracts.populateTransaction.useAllowanceOf(
        4325,   //4279  //PROJECT_ID,
        parseEther(payValue1.toString()), //  _amount
        //parseEther("0.0001"), //  _amount
        1, // _currency, address _token, uint256 _minReturnedTokens, string _memo
        "0x000000000000000000000000000000000000EEEe", // _token
        0, //_minReturnedTokens,
        "0x823b92d6a4b2AED4b15675c7917c9f922ea8ADAD", // _beneficiary,  /jango.eth
        "YO"  // _memo
        ) 

      const data2 = await writeContracts.populateTransaction.useAllowanceOf(
        4325,   //4279  //PROJECT_ID,
        parseEther(payValue2.toString()), //  _amount
        //parseEther("0.0001"), //  _amount
        1, // _currency, address _token, uint256 _minReturnedTokens, string _memo
        "0x000000000000000000000000000000000000EEEe", // _token
        0, //_minReturnedTokens,
        "0x6877be9E00d0bc5886c28419901E8cC98C1c2739", // _beneficiary, / nnnnicholas.eth
        "YO"  // _memo
        ) 

      if(checkedItems[0]){

        tx({
            to: "0x765A8b9a23F58Db6c8849315C04ACf32b2D55cF8",
            //value:  parseEther(contributionAmount), 
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
      }

     if(checkedItems[1]){

        tx({
            to: "0x765A8b9a23F58Db6c8849315C04ACf32b2D55cF8",
            //value:  parseEther(contributionAmount), 
            gasPrice: ethers.utils.hexlify(2000000000),
            gasLimit: ethers.utils.hexlify(3000000),
            data: data1["data"]
            },
            //writeContracts[contractName].create(selectedChainId, owners, signaturesRequired, {
            //  value: ethers.utils.parseEther("" + parseFloat(amount).toFixed(12)),
            //}),
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
     }

     if(checkedItems[2]){

        tx({
            to: "0x765A8b9a23F58Db6c8849315C04ACf32b2D55cF8",
            //value:  parseEther(contributionAmount), 
            gasPrice: ethers.utils.hexlify(2000000000),
            gasLimit: ethers.utils.hexlify(3000000),
            data: data2["data"]
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
     }
  
      setTxSent(true);
    } catch (e) {
      console.log("Transaction Loading Error: ", e);
    }
  };
  const { isOpen, onOpen, onClose} = useDisclosure();
  
  const Card = chakra('div', {
    baseStyle: {
      shadow: 'sm',
      rounded: 'sm',
      bg: 'black',
    },
  })
  
    return (
      <>
      <ChakraProvider>
        <Button size={["xl"]}  colorScheme="orange"  p={3}   onClick={onOpen}>  
            Fund Builder's Stream
        
        </Button>
        
        <Modal isCentered   isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent isCentered backgroundColor="black"  width="800px" height="600px" > 
            <ModalHeader  fontSize="20" textAlign="center" color={"orange"}>
            &nbsp;&nbsp; Project  🏰  Admin
            </ModalHeader>
            <ModalCloseButton color={"black"} />
            <ModalBody  textAlign="center" color={"gray"} margin="2px">
            <Checkbox
                size='lg'
                colorScheme='orange'
                isChecked={allChecked}
                isIndeterminate={isIndeterminate}
                onChange={(e) => { 
                    setCheckedItems([e.target.checked, e.target.checked, e.target.checked])
                    if(e.target.checked) {
                        setPayValue(value[0])
                        setPayValue1(value[1])
                        setPayValue2(value[2])
                    }
                    else {
                        setPayValue(0)
                        setPayValue1(0)
                        setPayValue2(0)
                    }
                }}
                >
                Select All
                </Checkbox>
                <Stack pl={6} mt={1} spacing={2}>
                
                <HStack>
                <Checkbox
                    size='lg'
                    colorScheme='orange'
                    isChecked={checkedItems[0]}
                    onChange={(e) => {
                        setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2]])
                        if(value[0] && e.target.checked) {
                            setPayValue(value[0])
                        }
                        else {
                            setPayValue(0)
                        }
                    }}
                >
                </Checkbox> 
                
                <InputGroup color='orange'>
                <InputLeftAddon children='Austin' />
                <NumberInput
                    textAlign="right"
                    onChange={(valueString) => {
                        setValue([valueString, value[1], value[2]])
                        console.log("checkedItems[0]: ", checkedItems[0])
                        if(valueString && checkedItems[0]) {
                            setPayValue(valueString)
                        }
                        else {
                            setPayValue(0)
                        }
                    }}
                    htmlSize={4} width='auto' defaultValue={.001} precision={3} step={0.1} min={0}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
                <InputRightAddon  children='ETH' />
                </InputGroup>
                </HStack>
                <HStack>
                <Checkbox
                    size='lg'
                    colorScheme='orange'
                    isChecked={checkedItems[1]}
                    onChange={(e) => {
                        setCheckedItems([checkedItems[0], e.target.checked,  checkedItems[2]])
                        if(value[1] && e.target.checked) {
                            setPayValue1(value[1])
                        }
                        else {
                            setPayValue1(0)
                        }
                    }}
                >
                </Checkbox> 
                
                <InputGroup color='orange'>
                <InputLeftAddon children='Jango' />
                <NumberInput
                    onChange={(valueString) => {
                        setValue([value[0], valueString, value[2]])
                        if(valueString && checkedItems[1]) {
                            setPayValue1(valueString)
                        }
                        else {
                            setPayValue1(0)
                        }
                    }}
                    
                    htmlSize={4} width='auto' defaultValue={.001} precision={3} step={0.1} min={0}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
                <InputRightAddon  children='ETH' />
                </InputGroup>
                </HStack>
                <HStack>
                <Checkbox
                    size='lg'
                    colorScheme='orange'
                    isChecked={checkedItems[2]}
                    onChange={(e) => {
                        setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked])
                        if(value[2] && e.target.checked) {
                            setPayValue2(value[2])
                        }
                        else {
                            setPayValue2(0)
                        }
                    }}
                >
                </Checkbox> 
                
                <InputGroup color='orange'>
                <InputLeftAddon children='Nico' />
                <NumberInput

                    onChange={(valueString) => {
                        setValue([value[0], value[1], valueString])
                        if(valueString && checkedItems[2]) {
                            setPayValue2(valueString)
                        }
                        else {
                            setPayValue2(0)
                        }
                    }}
                    htmlSize={4} width='auto' defaultValue={.001} precision={3} step={0.1} min={0} >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
                <InputRightAddon  children='ETH' />
                </InputGroup>
                </HStack>
            </Stack>
            <br></br><br></br>

            
           
            <Card fontSize="20" color={"orange"}>Funding Amount: {
            parseFloat(parseFloat(payValue) + parseFloat(payValue1) + parseFloat(payValue2)).toFixed(3)
            
                } ETH </Card>
                 <br></br><br></br>
            <Card fontSize="20" color={"orange"}>Available Overflow: {
            availableOverflow
            
                } ETH </Card>
                 <br></br><br></br>

            {txSent && (
                <CreateModalSentOverlay
                    txError={txError}
                    txSuccess={txSuccess}
                    pendingText="Transaction Pending"
                    successText="Success!"
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
                Fund
                </Button>
                <Button margin="1px" colorScheme={"yellow"} mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </ChakraProvider>
        </>
    )
  }
