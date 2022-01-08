import { hasEthereum } from '../utils/ethereum'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import useSwr from 'swr'
import Router from 'next/router'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Home() {

  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
  const { data, error } = useSwr('/api/hello', fetcher)

  useEffect( () => {
    const {pathname} = Router
    if(pathname == '/' ){
      Router.push('/calendar')
    }

    if(! hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`)
      return
    }
    async function setConnectedWalletAddress() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      try {
        const signerAddress = await signer.getAddress()
        setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
      } catch {
        setConnectedWalletAddressState('No wallet connected')
        return;
      }
    }
    setConnectedWalletAddress();
  }, [])

  if (error) return <div>Failed to load users</div>
  if (!data) return <div>Loading...</div>

  console.log('working')
  console.log(data)

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  function logout () {
    setConnectedWalletAddressState('No wallet connected')
  }

  async function clickTest() {
    console.log('clicked')
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    await requestAccount()
    const signerAddress = await signer.getAddress()
    setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
  }

  async function claim() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract('0xa1de2592f04b5829f7e23e18dd35e91d13be8b5c', ['function claim(uint256 id)'], signer)

    const transaction = await contract.claim(5)
    await transaction.wait()

    console.log(transaction)
  }

  return (
    <></>
  )
}
