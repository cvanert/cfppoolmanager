async function validAddress() {
    if (userAddress.slice(-4).toLowerCase() == '.eth') {
      const address = await provider.resolveName(userAddress);
      return ethers.utils.isAddress(address);
    }
    return ethers.utils.isAddress(userAddress);
  }