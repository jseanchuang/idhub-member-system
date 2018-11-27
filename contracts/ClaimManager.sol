pragma solidity 0.4.19;

import "./IdentityManager.sol";

contract ClaimManager {

    event ClaimAdded(address indexed identity, bytes32 indexed claimId, uint256 indexed claimType, uint256 scheme, address issuer, bytes signature, bytes data, string uri);
    event ClaimRemoved(address indexed identity, bytes32 indexed claimId, uint256 indexed claimType, uint256 scheme, address issuer, bytes signature, bytes data, string uri);

    struct Claim {
        uint256 claimType;
        uint256 scheme;
        address issuer; // msg.sender
        bytes signature; // this.address + claimType + data
        bytes data;
        string uri;
    }
    mapping (address => mapping(bytes32 => Claim)) claims;
    mapping (uint256 => bytes32[]) claimsByType;

    IdentityManager manager;

    /**
     * Constructor.
     * @param managerAddr The ClaimManager contract.
     */
    function ClaimManager(IdentityManager managerAddr) public {
        manager = managerAddr;
    }

    function addClaim(
        address identity,
        uint256 _claimType,
        uint256 _scheme,
        bytes _signature,
        bytes _data,
        string _uri
    )
        public
        returns (bytes32 claimRequestId)
    { 
        bytes32 claimId = keccak256(msg.sender, _claimType);

        if (claims[identity][claimId].issuer != msg.sender) {
            claimsByType[_claimType].push(claimId);
        }

        claims[identity][claimId].claimType = _claimType;
        claims[identity][claimId].scheme = _scheme;
        claims[identity][claimId].issuer = msg.sender;
        claims[identity][claimId].signature = _signature;
        claims[identity][claimId].data = _data;
        claims[identity][claimId].uri = _uri;
  
        ClaimAdded(
            identity,
            claimId,
            _claimType,
            _scheme,
            msg.sender,
            _signature,
            _data,
            _uri
        );

        return claimId;
    }

    function removeClaim(address identity, bytes32 _claimId) public returns (bool success) {
        require(manager.isOwner(identity, msg.sender) || claims[identity][_claimId].issuer == msg.sender);

        ClaimRemoved(
            identity,
            _claimId,
            claims[identity][_claimId].claimType,
            claims[identity][_claimId].scheme,
            claims[identity][_claimId].issuer,
            claims[identity][_claimId].signature,
            claims[identity][_claimId].data,
            claims[identity][_claimId].uri
        );

        delete claims[identity][_claimId];
        return true;
    }

    function getClaim(address identity, bytes32 _claimId)
        public
        constant
        returns(
            uint256 claimType,
            uint256 scheme,
            address issuer,
            bytes signature,
            bytes data,
            string uri
        )
    {
        return (
            claims[identity][_claimId].claimType,
            claims[identity][_claimId].scheme,
            claims[identity][_claimId].issuer,
            claims[identity][_claimId].signature,
            claims[identity][_claimId].data,
            claims[identity][_claimId].uri
        );
    }


   
}