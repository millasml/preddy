pragma solidity >=0.4.21;

contract Utils {
    function copy(uint256[] memory src, uint256[] memory dest) internal pure {
        require(src.length <= dest.length, "source length must be smaller than destination length");
        for (uint256 i=0; i<src.length; i++) {
            dest[i] = src[i];
        }
    }
}