import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import useSwr from 'swr'
import { hasEthereum } from '../utils/ethereum'
import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'
import { Container, Row, Col, Modal, Text, Button } from '@nextui-org/react'

const localizer = momentLocalizer(moment)

export default function CalendarPage() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState('')
  const [events, setEvents] = useState('')
  const { data, error } = useSwr('/api/bscpad', fetcher)
  const [eventsReady, setEventsReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const [event, setEvent] = useState('')

  if (data && !eventsReady) {
    console.log('data ready')
    console.log(data)
    console.log(events)

    let eventsArray = []

    data.forEach(ido => {
      ido.claims.forEach((claim, index) => {
        let sep = claim.split(' ')
        let yymmdd = sep[0].split('-')
        let date = new Date('20' + yymmdd[0], parseInt(yymmdd[1]) - 1, yymmdd[2])
        let hhmm = sep[1].split(':')
        date.setHours(hhmm[0], hhmm[1])
        eventsArray.push({
          title: ido.title,
          start: date,
          end: date,
          address: ido.address,
          index: index+1,
        })
      })
    })
    setEvents(eventsArray)
    setEventsReady(true)
  }

  useEffect( () => {
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



  function handleSelectEvent(event) {
    console.log(event)
    setEvent(event)
    setVisible(true)
  }

  function closeHandler() {
    setVisible(false)
  }

  async function claimHandler() {
    console.log('claim')
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(event.address)
    const contract = new ethers.Contract(event.address, ['function claim(uint256 id)'], signer)

    const transaction = await contract.claim(event.index)
    await transaction.wait()

    console.log(transaction)
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' } )
  }

  async function connect() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    await requestAccount()
    const signerAddress = await signer.getAddress()
    setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`)
  }

  return (
    <Container>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            {event.title}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Button auto shadow onClick={claimHandler}>
            Claim
          </Button>
        </Modal.Body>
      </Modal>

      <Button onClick={connect}>
        Connect Metamask
      </Button>

      <div>
        <div className="h-4">
          { connectedWalletAddress && <p className="text-md">{connectedWalletAddress}</p> }
        </div>
        <Calendar
          events={events}
          step={60}
          showMultiDayTimes
          onSelectEvent={(event) => handleSelectEvent(event)}
          style={{ height: 500 }}
          localizer={localizer}
        />
      </div>
    </Container>
  )
}
