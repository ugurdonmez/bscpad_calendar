function hasEthereum () {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
}

export { hasEthereum }
