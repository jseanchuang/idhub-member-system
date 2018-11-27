pragma solidity 0.4.19;

import "./IdentityManager.sol";

contract ProfileManager {

    event NameChanged(address indexed identity, string name);

    struct Record {
          string name;
          string email;
          bytes picture; // IPFS hash for profile pifcutre
      }

    mapping (address => Record) records;

    IdentityManager manager;

    modifier onlyOwner(address identity) {
        require(manager.isOwner(identity, msg.sender));
        _;
    }

    /**
     * Constructor.
     * @param managerAddr The ProfileManager contract.
     */
    function ProfileManager(IdentityManager managerAddr) public {
        manager = managerAddr;
    }

    function setName(address identity, string name) public onlyOwner(identity) {
        records[identity].name = name;
        NameChanged(identity, name);
    }

    function name(address identity) public view returns (string) {
        return records[identity].name;
    }


   
}