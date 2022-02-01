import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, HStack, Box, Spacer, Text, Heading, Input, Button, Slider, SliderTrack, SliderFilledTrack, Table, Thead, Th, Tr, Tbody, Td, Image, Link, useColorModeValue, Center, Spinner, AlertDialog, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react'
import React from 'react';
import Web3 from 'web3';

import { load } from '../src/funcs';


const Loading = () => {
  const bg = useColorModeValue('gray.200', 'gray.600');
  return (
    <VStack minH='800px' bg={bg} w='full'>
      <Spacer />
      <Center>
        <Spinner />
      </Center>
      <Spacer />
    </VStack>
  );
};

const Home: NextPage = () => {
  const bg = useColorModeValue('gray.200', 'gray.700');
  const hBG = useColorModeValue('gray.300', 'gray.500');
  const sliderBG = useColorModeValue('blue.300', 'blue.500');
  const filled = useColorModeValue('gray.300', 'gray.600');
  
  // React.useState
  const [refresh, setRefresh] = React.useState<boolean>(true);
  const [account, setAccount] = React.useState<any>(null);
  const [contractFT, setContractFT] = React.useState<any>(null);
  const [contractFTS, setContractFTS] = React.useState<any>(null);
  const [tokensSold, setTokensSold] = React.useState<any>(null);
  const [transactionCount, setTransactionCount] = React.useState<any>(null);
  const [ethFunds, setEthFunds] = React.useState<any>(null);
  const [FTtoETH, setFTtoETH] = React.useState<any>(null);
  const [myFT, setMyFT] = React.useState<number>(0);
  const [transactions, setTransactions] = React.useState<any[]>([]);

  // Modal
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const onClose = () => setIsOpen(false);
  const [inputValue, setInputValue] = React.useState<number>(0);
  const handleInput = (e:any) => setInputValue(e.currentTarget.value);


  const handleUseEffect = async () => {
    if (!refresh) return;
    setRefresh(false);
    load().then((e) => {
      setAccount(e.account);
      setContractFT(e.contractFT);
      setContractFTS(e.contractFTS);
      setTokensSold(e.tokensSold);
      setTransactionCount(e.transactionCount);
      setEthFunds(e.ethFunds);
      const ftETH = (50 / e.ethPriceN).toFixed(2);
      setFTtoETH(ftETH);
      setTransactions(e.transactions)
      setMyFT(e.myFT);
    });
  };

  // React.useEffect
  React.useEffect(() => { handleUseEffect(); } );


  // Functions
  const isLoading = () => account == null || contractFT == null || contractFTS == null || tokensSold == null || transactionCount == null || ethFunds == null || FTtoETH == null;
  const SliderValue = () => {
    const bigInt = 750000000 * 10**18;
    const r = ((tokensSold * 100) / bigInt);
    return r;
  };
  const buyTokens = async () => {
    const big = BigInt(inputValue * 10**18);
    await contractFTS.buyToken(big, {
      from: account,
      value: inputValue * FTtoETH * 10**18,
      gas: 500000 // Gas limit
    });
    setIsOpen(false);
    setRefresh(true);
  };

  return (
    isLoading() ? <Loading /> :
    <VStack minH='800px' w='full' bg={bg}>
      <HeaderFT />
      {/* Desktop */}
      <HStack w='md' display={{lg: 'flex', md: 'flex', sm: 'none', base: 'none'}}>
        <Heading size='md'>1FT = 50 USD = {FTtoETH} ETH</Heading>
        <Spacer/>
        <Link href='https://faucets.chain.link/' isExternal>
          <Button bg='gray.600' color='gray.200' variant='link' w='100px' minH='40px'>Get ETH</Button>
        </Link>
      </HStack>
      {/* Mobile */}
      <HStack w='full' display={{lg: 'none', md: 'none', sm: 'flex', base: 'flex'}}>
        <Box w='5px'/>
        <Heading size='md'>1FT = 50 USD = {FTtoETH} ETH</Heading>
        <Spacer/>
        <Link href='https://faucets.chain.link/' isExternal>
          <Button bg='gray.600' color='gray.200' variant='link' w='100px' minH='40px'>Get ETH</Button>
        </Link>
        <Box w='5px'/>
      </HStack>
      <Box h='10px'/>
      {/* Desktop */}
      <HStack w='md' display={{lg: 'flex', md: 'flex', sm: 'none', base: 'none'}}>
        <Slider value={SliderValue()} h='50px'>
          <SliderTrack bg={sliderBG} h='25px' borderRadius={8}>
            <SliderFilledTrack bg={filled}/>
            <Center>
              <Text>{Number(tokensSold).toFixed()} / 750.000.000 FT</Text>
            </Center>
          </SliderTrack>
        </Slider>
      </HStack>
      {/* Mobile */}
      <HStack w='full' display={{lg: 'none', md: 'none', sm: 'flex', base: 'flex'}}>
        <Box w='10px' />
        <Slider value={SliderValue()} h='50px'>
          <SliderTrack bg={sliderBG} h='25px' borderRadius={8}>
            <SliderFilledTrack bg={filled}/>
            <Center>
              <Text>{Number(tokensSold).toFixed()} / 750.000.000 FT</Text>
            </Center>
          </SliderTrack>
        </Slider>
        <Box w='10px' />
      </HStack>
      <Button bg='green.400' onClick={ () => setIsOpen(true) }>BUY TOKENS</Button>
      <Box h='10px' />
      {/* Desktop */}
      <HStack w='md' h='50px' bg={hBG} borderRadius={8} display={{lg: 'flex', md: 'flex', sm: 'none', base: 'none'}}>
        <Box w='5px'/>
        <Image 
        src='https://cdn-icons-png.flaticon.com/512/876/876784.png'
        alt='transactions'
        boxSize='30px'
        />
        <Box w='1px'/>
        <Text>{transactionCount} Transactions</Text>
      </HStack>
      {/* Mobile */}
      <HStack w='full'  display={{lg: 'none', md: 'none', sm: 'flex', base: 'flex'}}>
        <Box w='10px'/>
        <HStack w='full' h='50px' bg={hBG} borderRadius={8}>
          <Box w='5px'/>
          <Image 
          src='https://cdn-icons-png.flaticon.com/512/876/876784.png'
          alt='transactions'
          boxSize='30px'
          />
          <Box w='1px'/>
          <Text>{transactionCount} Transactions</Text>
        </HStack>
        <Box w='10px'/>
      </HStack>
      {/* Desktop */}
      <HStack w='md' h='50px' bg={hBG} borderRadius={8} display={{lg: 'flex', md: 'flex', sm: 'none', base: 'none'}}>
        <Image
        src='https://i.ibb.co/JsHvk03/eth.png'
        alt='eth'
        boxSize='50px'
        />
        <Text>{(ethFunds / 10**18).toFixed(2)} ETH Founded</Text>
      </HStack>
      {/* Mobile */}
      <HStack w='full'  display={{lg: 'none', md: 'none', sm: 'flex', base: 'flex'}}>
        <Box w='10px'/>
        <HStack w='full' h='50px' bg={hBG} borderRadius={8}>
         <Image
          src='https://i.ibb.co/JsHvk03/eth.png'
          alt='eth'
          boxSize='50px'
          />
          <Text>{(ethFunds / 10**18).toFixed(2)} ETH Founded</Text>
        </HStack>
        <Box w='10px'/>
      </HStack>
      {/* Desktop */}
      <HStack w='md' h='50px' bg={hBG} borderRadius={8} display={{lg: 'flex', md: 'flex', sm: 'none', base: 'none'}}>
        <Box w='15px' />
        <Text>My Address: {account}</Text>
      </HStack>
      {/* Mobile */}
      <HStack w='full' display={{lg: 'none', md: 'none', sm: 'flex', base: 'flex'}}>
        <Box w='10px'/>
        <HStack w='full' h='50px' bg={hBG} borderRadius={8}>
          <Box w='15px' />
          <Text fontSize='xs'>My Address: {account}</Text>
        </HStack>
        <Box w='10px'/>
      </HStack>
      {/* Desktop */}
      <HStack w='md' h='50px' bg={hBG} borderRadius={8} display={{lg: 'flex', md: 'flex', sm: 'none', base: 'none'}}>
        <Image
        src='https://i.ibb.co/3kmQ59f/memoji-guino.webp'
        alt='FT Token'
        boxSize='50px'
        />
        <Text>{myFT}</Text>
      </HStack>
      {/* Mobile */}
      <HStack w='full' display={{lg: 'none', md: 'none', sm: 'flex', base: 'flex'}}>
        <Box w='10px' />
        <HStack w='full' h='50px' bg={hBG} borderRadius={8}>
          <Image
          src='https://i.ibb.co/3kmQ59f/memoji-guino.webp'
          alt='FT Token'
          boxSize='50px'
          />
          <Text>{myFT}</Text>
        </HStack>
        <Box w='10px' />
      </HStack>
      <Box h='20px'/>
      <Heading>Last Transactions</Heading>
      {/* Desktop */}
      <HStack w='full' display={{lg: 'flex', md: 'flex', sm: 'none', base: 'none'}}>
      {
        transactions.length == 0 ? null :
        <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Address</Th>
            <Th>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            transactions.map((tran, idx) =>
            <Tr key={idx}>
            <Td fontSize='10px'>{tran[0]}</Td>
            <Td>{(tran[1] / 10**18).toFixed()}</Td>
          </Tr>
            )
          }
        </Tbody>
      </Table>
      }
      </HStack>
      {/* Mobile */}
      <HStack w='full' display={{lg: 'none', md: 'none', sm: 'flex', base: 'flex'}}>
      {
        transactions.length == 0 ? null :
        <VStack w='full'>
          <HStack w='full'>
            <Box w='10px' />
            <Text color={filled}>Address</Text>
            <Spacer />
            <Text color={filled}>Amount</Text>
            <Box w='10px' />
          </HStack>
          <Box h='10px'/>
          {
            transactions.map((tran, idx) =>
            <HStack w='full' key={idx}>
              <Box w='10px' />
              <Text fontSize='xs'>{tran[0]}</Text>
              <Spacer />
              <Text>{(tran[1] / 10**18).toFixed(2)}</Text>
              <Box h='10px' w='10px' />
            </HStack>
            )
          }
        </VStack>
      }
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy FT</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Input
            placeholder='1 FT'
            type='number'
            value={inputValue}
            onChange={handleInput}
            size='md'
            />
          </ModalBody>
          <ModalFooter>
            <Button bg='green.400' onClick={buyTokens}>BUY</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

const HeaderFT = () => {
  return (
    <VStack>
       <Head>
        <title>Facu Token ICO</title>
        <meta name="description" content="FacuTokenICO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box h='5px'/>
      <HStack w='full'>
        <Spacer />
        <Heading size='2xl'>Facu Token ICO</Heading>
        <Spacer />
      </HStack>
      <Box h='10px'/>
    </VStack>
  );
};


export default Home
