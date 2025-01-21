// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calculator {
    uint256 public result;

    // Function to add two numbers and store the result
    function add(uint256 a, uint256 b) public {
        result = a + b;
    }

    // Function to subtract two numbers and store the result
    function subtract(uint256 a, uint256 b) public {
        require(a >= b, "Result would be negative");
        result = a - b;
    }

    // Function to multiply two numbers and store the result
    function multiply(uint256 a, uint256 b) public {
        result = a * b;
    }

    // Function to divide two numbers and store the result
    function divide(uint256 a, uint256 b) public {
        require(b > 0, "Cannot divide by zero");
        result = a / b;
    }

    // Function to get the current result
    function getResult() public view returns (uint256) {
        return result;
    }
}