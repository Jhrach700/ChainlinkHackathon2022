import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Tooltip, Modal, Input, Alert, Spin, Button } from "antd";
import {  ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp, } from "providers/MoralisDappProvider/MoralisDappProvider";

import { useWeb3ExecuteFunction } from "react-moralis";
import axios from 'axios';
import { ethers, ContractFactory } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'


const nftaddress = "0xb7F48F75348213e2F739f2C4026C6242f9526b8c"


const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

function CreatedCoupons() {
  const [CreatedNFTs, setCreatedNFTs] = useState([]);
  const { Moralis, enableWeb3 } = useMoralis();
  const [loaded, setLoaded] = useState('false')
  const [rand, setRand] = useState('blah')
  const [loading, setLoading] = useState(false);
  const [nftToSend, setNftToSend] = useState(null);
  const [visible, setVisibility] = useState(false);
  const [price, setPrice] = useState(1);
  const [NumberNFTs, setNumberNFTs] = useState(1);

  const { chainId, marketAddress, contractABI, walletAddress } = useMoralisDapp();

  const contractProcessor = useWeb3ExecuteFunction();
  //const listItemFunction = "TLuNFTMarket";
  const listItemFunction = "createMarketItem";

  const createMultiMarketItem = "createMultiMarketItem";

  const contractABIJson = JSON.parse(contractABI);

  const contractABIJson2 = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "sold",
          "type": "bool"
        }
      ],
      "name": "MarketItemCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "MarketItemSold",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "createMarketItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        }
      ],
      "name": "createMarketSale",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nftContract",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "tokenId",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "createMultiMarketItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "fetchMarketItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "nftContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            }
          ],
          "internalType": "struct marketPlaceBoilerPlate.MarketItem[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  //console.log("created nfts:", CreatedNFTs)

  useEffect(() => {

    if (loaded == 'false') {
      const NFTMetadata = Moralis.Object.extend("NFTMetadata");
      const query = new Moralis.Query(NFTMetadata);
      const currentUser = Moralis.User.current();
      //setCreatedNFTs(fetch(query,currentUser))
      fetch(query, currentUser).then(function (res) {
        if (res.length > 0) {
          //alert("MAJOR ALERT!")
        }
        console.log("res:", res)
        setCreatedNFTs(res)
        setLoaded('true')
      })

      //query_cloud().then(function (res) {
      //  //if (res.length > 0) {
      //  //  alert("MAJOR ALERT!",res)
      //  //}
      //  //console.log("res:", res)
      //  //setCreatedNFTs(res)
      //  //setLoaded('true')
      //  console.log("res:",res)
      //})


    } else {
      //console.log("market address:", marketAddress)
      setRand("rancid")
    }

  });

  async function query_cloud() {
    Moralis.Cloud.run("getCollections").then(function (res) {
      //if (res.length > 0) {
      //  //alert("MAJOR ALERT!")
      //}
      console.log("Collections!:", res)
      //setCreatedNFTs(res)
      //setLoaded('true')
      return res;
    })
  }

  function succList() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Your NFT was listed on the marketplace`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);

  }

  function succApprove() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Approval is now set, you may list your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failList() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem listing your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function approveAll(nft) {
    setLoading(true);
    const ops = {
      contractAddress: nft.collection.attributes.NFTsol_addr,
      functionName: "setApprovalForAll",
      abi: [{ "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
      params: {
        operator: "0xcc937ED5ab9A614a0660262f96882Edc08Bce1c4",
        approved: true
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("Approval Received");
        setLoading(false);
        setVisibility(false);
        succApprove();
      },
      onError: (error) => {
        setLoading(false);
        failApprove();
      },
    });
  }


  async function fetch(query, currentUser) {
    //console.log("CU:",currentUser)
    //query.equalTo("URI", "https://ipfs.moralis.io:2053/ipfs/QmejP9QfyVF4LNc28T4ASbLLyrwzopWDZ9g5dGqx2mrAGo");
    query.equalTo("CurrUser", currentUser);
    query.equalTo("minted", "false");
    const results = await query.find();


    var nft_metadata = []
    console.log("res:", results)
    for (let i = 0; i < results.length; i++) {
      const object = results[i];
      console.log("obj:", object)
      //console.log(object.id + ' - ' + object.get('CurrUser'));
      //console.log(object.id + ' - ' + object.get('URI'));
      //console.log("--")
      //var myVar = object.attributes.Collection.attributes.collection_name
      //console.log("HOO:",myVar)
      var myVar = object.get("Collection")
      var garbage = null
      if (typeof myVar !== 'undefined') {
        garbage = object.attributes.Collection
        //console.log("myVar:",myVar)
        //console.log(myVar.)
      }
      //console.log("Collection:",object.get("Collection").get("collection_name"))
      console.log("object id:", object.id)


      axios.get(object.get('URI'))
        .then(res => {
          let metadata = res.data;
          //console.log("metadata:",metadata)
          metadata.uri = object.get('URI')
          //metadata.collection = object.get("Collection")
          metadata.collection = garbage
          metadata.id2 = object.id
          //console.log("metadata:",metadata)
          nft_metadata.push(metadata);

        })
    }

    return nft_metadata;
  }

  function handleSellClick(nft, listPrice) {
    console.log("nasty nft:", nft)
    console.log("uri:", nft.uri)
    console.log("market address:", marketAddress)
    //createSale(nft.uri)
    //query_test(nft)
    deploy(nft, listPrice)
  }

  const handleSellClick2 = (nft, index) => {
    console.log("nasty index clicked!:", index)
    console.log("nasty nft!:", nft)
    console.log("market address:", marketAddress)
    nft.index = index
    setNftToSend(nft);
    setVisibility(true);
  };



  async function deploy(nft, listPrice) {
    //console.log("nft is in collection:",nft.collection.attributes.collection_name)
    //var h = nft.collection.attributes.
    var addr = nft.collection.attributes.NFTsol_addr
    if (typeof addr === 'undefined') {
      //console.log("addr:",addr)

      var token_id = await general_deploy(nft, listPrice)
      await approveAll(nft)
      //var listPrice2 = token_id
      //var listPrice2 = []
      //for (let i = 0; i < NumberNFTs; i++) {
      //  listPrice2.push(String(listPrice * ("1e" + 18)));
      //}
      list2(nft, listPrice, token_id)

      /*       var token_id = await general_deploy(nft, listPrice)
            await approveAll(nft)
            list(nft, listPrice, token_id)
            CreatedNFTs.splice(nft.index, 1);
            setCreatedNFTs(CreatedNFTs)
            perform_update(nft) */
    } else {
      //Smart contract for this collection already exists, so skip deploying step!
      //alert("Starting general mint!")
      var token_id = await general_mint(nft, listPrice)
      await approveAll(nft)
      //var listPrice2 = token_id
      //var listPrice2 = []
      //for (let i = 0; i < NumberNFTs; i++) {
      //  listPrice2.push(String(listPrice * ("1e" + 18)));
      //}
      list2(nft, listPrice, token_id)
      /*       //alert("should be done minting. calling approve all")
            await approveAll(nft)
            //alert("should be done approving, and about to call list!")
            list(nft, listPrice, token_id)
            CreatedNFTs.splice(nft.index, 1);
            setCreatedNFTs(CreatedNFTs)
            perform_update(nft) */
    }

  }







  async function perform_update(nft) {
    const createdNft = Moralis.Object.extend("createdNft");
    const query = new Moralis.Query(createdNft);
    //const currentUser = Moralis.User.current();
    //setCreatedNFTs(fetch(query,currentUser))
    //query.equalTo("owner", walletAddress);
    //query.equalTo("minted", "false");
    const results = await query.find();
    console.log("RESULTS:", results)
    console.log("RESULTS:", results.length)
  }



  async function list2(nft, listPrice, token_id_arr) {
    setLoading(true);
    //const p = listPrice * ("1e" + 18);
    console.log("nft.collection.attributes.NFTsol_addr:", nft.collection.attributes.NFTsol_addr)
    const p = listPrice * ("1e" + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: "createMultiMarketItem",
      abi: contractABIJson2,
      params: {
        nftContract: nft.collection.attributes.NFTsol_addr,
        //nftContract: "0x2c2611bca71f985e26f8beba5dde8b1b0a4186fe",
        tokenId: token_id_arr,
        //tokenId: token_id,
        price: String(p),
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        //addItemImage();
        succList();
      },
      onError: (error) => {
        console.log("error:", error)
        alert("NASTY ERROR:", error)
        setLoading(false);
        failList();
      },
    });

  }

  async function list(nft, listPrice, token_id) {
    setLoading(true);
    const p = listPrice * ("1e" + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: listItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nft.collection.attributes.NFTsol_addr,
        //nftContract: "0x2c2611bca71f985e26f8beba5dde8b1b0a4186fe",
        tokenId: token_id,
        //tokenId: token_id,
        price: String(p),
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        //addItemImage();
        succList();
      },
      onError: (error) => {
        console.log("error:", error)
        alert("NASTY ERROR:", error)
        setLoading(false);
        failList();
      },
    });

  }



  async function general_mint(nft, listPrice) {
    console.log("nft.collection.attributes.NFTsol_addr:", nft.collection.attributes.NFTsol_addr)
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(nft.collection.attributes.NFTsol_addr, NFT.abi, signer)

    //let transaction = await contract.createToken(nft.uri)
    alert("about to call create multi token function!")
    let transaction = await contract.createmultiToken(nft.uri, NumberNFTs)

    let tx = await transaction.wait()
    //let event = tx.events[0]
    let event = tx.events
    //let value = event.args[2]
    console.log("event:", event)
    console.log("tx:", tx)

    var token_ids_arr = []

    for (let i = 0; i < NumberNFTs; i++) {
      token_ids_arr.push(parseInt(event[i * 2].args.tokenId._hex, 16).toString())
    }
    console.log("token_ids_arr:", token_ids_arr)

    //parseInt(event.args.tokenId._hex, 16);
    //var token_id = parseInt(event.args.tokenId._hex, 16).toString()
    ////var token_id = event.args.tokenId.toString()
    ////alert("successfully minted an nft!")
    //const NFTMetadata = Moralis.Object.extend("NFTMetadata");
    //const query2 = new Moralis.Query(NFTMetadata);
    ////query.get(nft.collection.attributes.object)
    ////query.equalTo("NFTsol_addr", nft.collection.attributes.NFTsol_addr);
    //const currentUser = Moralis.User.current();
    //query2.get(nft.id2).then((res) => {
    //  console.log("res:")
    //  res.set("minted", "true")
    //  res.set("owner", currentUser)
    //  res.set("token_id", parseInt(token_id))
    //  res.set("list_price", listPrice)
    //  res.save()
    //  //alert("successfully updated nft's mint column!")
    //  // The object was retrieved successfully.
    //}, (error) => {
    //  // The object was not retrieved successfully.
    //  // error is a Moralis.Error with an error code and message.
    //});

    return token_ids_arr

  }

  //This "general deploy" smart contract should literally only be deployed once. It's for NFTs where users don't specify any specific
  //collections. In production this is kind've dumb because it means that the first ever user will have to pay a gas fee to deploy this general
  //smart contract. This worked once so not touching it again to make it cleaner code.

  async function general_deploy(nft, listPrice) {
    var collection_name = "General Collection";
    var token_name = "CouponMint";
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const path = "data"
    var factory = new ContractFactory(NFT.abi, NFT.bytecode, signer)
    //Polygon = #1
    //const apiConsumer2 = await factory.deploy("0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B", collection_name, token_name);

    //AVAX
    //const apiConsumer2 = await factory.deploy("0xcc937ED5ab9A614a0660262f96882Edc08Bce1c4", collection_name, token_name);

    //New?
    //const apiConsumer2 = await factory.deploy("0x3fd844415ebe0D161c322A0FDDc8107fc3B05ce1", collection_name, token_name);

    //Mumbai (NEW):
    alert("deploying to mumbai!!!!")
    const apiConsumer2 = await factory.deploy(marketAddress, collection_name, token_name);

    var waitcontract = await apiConsumer2.deployTransaction.wait();
    //pass in parameters here
    //var apiConsumer2 = await factory.deploy(url,path)
    //alert("successfully deployed")
    //alert(apiConsumer2.address)

    const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
    const query = new Moralis.Query(CollectionsTracker);
    //query.get(nft.collection.attributes.object)
    //query.equalTo("NFTsol_addr", nft.collection.attributes.NFTsol_addr);
    query.get(nft.collection.id).then((res) => {
      console.log("res:")
      res.set("NFTsol_addr", apiConsumer2.address)
      res.set("NFTsol_addr_lowercase", apiConsumer2.address.toLowerCase())
      //alert("successfully updated nft's smart contract address")
      res.save()
      // The object was retrieved successfully.
    }, (error) => {
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
    });

    let contract = new ethers.Contract(apiConsumer2.address, NFT.abi, signer)
    //let transaction = await contract.createToken(nft.uri)
    alert("create multi Token about to be called!!!")
    let transaction = await contract.createmultiToken(nft.uri, NumberNFTs)
    let tx = await transaction.wait()
    //let event = tx.events[0]
    let event = tx.events
    //let value = event.args[2]
    console.log("event:", event)
    console.log("tx:", tx)

    var token_ids_arr = []

    for (let i = 0; i < NumberNFTs; i++) {
      token_ids_arr.push(parseInt(event[i * 2].args.tokenId._hex, 16).toString())
    }
    console.log("token_ids_arr:", token_ids_arr)


    /*     let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2] */
    /*     var token_id = parseInt(event.args.tokenId._hex, 16).toString()
        //alert("successfully minted an nft!")
        const NFTMetadata = Moralis.Object.extend("NFTMetadata");
        const query2 = new Moralis.Query(NFTMetadata);
        //query.get(nft.collection.attributes.object)
        //query.equalTo("NFTsol_addr", nft.collection.attributes.NFTsol_addr);
        const currentUser = Moralis.User.current();
        query2.get(nft.id2).then((res) => {
          console.log("res:")
          res.set("minted", "true")
          res.set("owner", currentUser)
          res.set("token_id", parseInt(token_id))
          res.set("list_price", listPrice)
          //alert("successfully updated nft's mint column!")
          res.save()
          // The object was retrieved successfully.
        }, (error) => {
          // The object was not retrieved successfully.
          // error is a Moralis.Error with an error code and message.
        });
    
        return token_id; */
    return token_ids_arr;

  }


  //async function mint(url, addr) {
  //  const web3Modal = new Web3Modal()
  //  const connection = await web3Modal.connect()
  //  const provider = new ethers.providers.Web3Provider(connection)
  //  const signer = provider.getSigner()
  //  let contract = new ethers.Contract(addr, NFT.abi, signer)
  //  let transaction = await contract.createToken(url)
  //  let tx = await transaction.wait()
  //  let event = tx.events[0]
  //  let value = event.args[2]
  //  alert("successfully minted an nft!")
  //}


  function log() {
    console.log("price:", price)
  }

  async function general_deploy1000(nft) {
    var collection_name = "General Collection";
    var token_name = "CouponMint";
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const path = "data"
    var factory = new ContractFactory(NFT.abi, NFT.bytecode, signer)
    //Polygon = #1
    //const apiConsumer2 = await factory.deploy("0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B", collection_name, token_name);

    //AVAX
    //const apiConsumer2 = await factory.deploy("0xcc937ED5ab9A614a0660262f96882Edc08Bce1c4", collection_name, token_name);

    //New?
    //const apiConsumer2 = await factory.deploy("0x3fd844415ebe0D161c322A0FDDc8107fc3B05ce1", collection_name, token_name);

    //Mumbai (NEW):
    alert("deploying to mumbai!!!!")
    const apiConsumer2 = await factory.deploy(marketAddress, collection_name, token_name);

    var waitcontract = await apiConsumer2.deployTransaction.wait();


    const CollectionsTracker = Moralis.Object.extend("CollectionsTracker");
    const query = new Moralis.Query(CollectionsTracker);
    //query.get(nft.collection.attributes.object)
    //query.equalTo("NFTsol_addr", nft.collection.attributes.NFTsol_addr);
    query.get(nft.collection.id).then((res) => {
      console.log("res:")
      res.set("NFTsol_addr", apiConsumer2.address)
      //alert("successfully updated nft's smart contract address")
      res.save()
      // The object was retrieved successfully.
    }, (error) => {
      // The object was not retrieved successfully.
      // error is a Moralis.Error with an error code and message.
    });

    let contract = new ethers.Contract(apiConsumer2.address, NFT.abi, signer)
    //let transaction = await contract.createToken(nft.uri)
    alert("airdrop about to be called!!!")
    let transaction = await contract.airdrop(nft.uri, ["0xF7724524774F58374C8b90fcCABeC7667eE31229", "0x532391c8778997a55fC15c8F85B0e2900C5b95A2", "0xe5e91B52361dAb185AE4dFd22636DD4A1d3123A1", "0x1676b3E4282AeA747BC64E955E939Af7e920A2bf", "0xA73FB6BaBB716A75Cc5417345F983EbcdCF5BAeE"])
    let tx = await transaction.wait()
    //let event = tx.events[0]
    let event = tx.events
    //let value = event.args[2]
    console.log("event:", event)
    console.log("tx:", tx)
    var token_ids_arr = []

    for (let i = 0; i < NumberNFTs; i++) {
      token_ids_arr.push(parseInt(event[i * 2].args.tokenId._hex, 16).toString())
    }
    console.log("token_ids_arr:", token_ids_arr)


    return token_ids_arr;

  }


  if (!CreatedNFTs.length) return (
    <>
      <h1 className="block mb-2 text-2xl font-medium">No NFTs created yet!</h1>
    </>
  )

  //console.log(Created);
  return (
    <>
      <div className="container">


        <div style={styles.NFTs}>
          {CreatedNFTs &&
            CreatedNFTs.map((nft, index) => (
              <Card
                hoverable
                actions={[


                  <Tooltip title="List this NFT" key={index}>
                    <ShoppingCartOutlined onClick={() => handleSellClick2(nft, index)} />
                  </Tooltip>,

                ]}
                style={{ width: 240, border: "2px solid #e7eaf3" }}
                cover={
                  <img
                    preview={false}
                    src={nft?.image || "error"}
                    fallback="data:image/png;base64,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"
                    alt=""
                    style={{ height: "300px" }}
                  />
                }
                key={index}
              >
                <div className="div pb-1">{nft.collection.attributes.collection_name}</div>
                <Meta title={nft.name} description={nft.token_address} />
              </Card>
            ))}
        </div>

        <Modal
          title={`List ${nftToSend?.name} For Sale`}
          visible={visible}

          onCancel={() => setVisibility(false)}
          onOk={() => handleSellClick(nftToSend, price)}
          okText="List"
          footer={[
            <Button onClick={() => setVisibility(false)} type="primary" key={nftToSend?.index}>
              Cancel
            </Button>,
            <Button onClick={() => handleSellClick(nftToSend, price)} type="primary" key={nftToSend?.index}>
              List
            </Button>,
            <Button onClick={() => general_deploy1000(nftToSend)} type="primary" key={nftToSend?.index}>
              Airdrop
            </Button>

          ]}
        >
          <Spin spinning={loading}>
            <div className=" flex flex-col justify-center items-center">
              <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToSend?.image}`} />

              {/* <img className="h-64 w-60 object-fill p-5" width="" src={`${nftToSend?.couponImage}`} /> */}
            </div>

            {/*         <div className="div">
        {nftToSend.description !== null ? <div className="div pb-3">Description: {nftToSend.description}</div> : <div className="div"></div>}
        </div> */}



            <div className="flex flex-row">
              <span className="block mb-2 text-sm font-medium">Description: </span><span>&nbsp;{nftToSend?.description}</span>
            </div>



            <Input
              autoFocus
              placeholder="Listing Price in MATIC"
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              autoFocus
              placeholder="Number of NFTs to mint"
              onChange={(e) => setNumberNFTs(e.target.value)}
            />



          </Spin>
        </Modal>


      </div>
    </>

  );
}

export default CreatedCoupons;
