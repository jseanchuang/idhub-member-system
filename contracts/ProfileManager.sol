pragma solidity 0.4.19;

import "./IdentityManager.sol";

contract ProfileManager {

    event NameChanged(address indexed identity, string name);
    event EmailChanged(address indexed identity, string email);
    event PictureChanged(address indexed identity, bytes picture);

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

    function setEmail(address identity, string email) public onlyOwner(identity) {
        records[identity].email = email;
        EmailChanged(identity, email);
    }

    function email(address identity) public view returns (string) {
        return records[identity].email;
    }

    function setPicture(address identity, bytes picture) public onlyOwner(identity) {
        records[identity].picture = picture;
        PictureChanged(identity, picture);
    }

    function picture(address identity) public view returns (bytes) {
        return records[identity].picture;
    }


   
}