pragma solidity ^0.8.0;


contract Token {
    string public name = "Crypton ERC-20 task";
    string public symbol = "CET";
    uint8 public decimals = 18;

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 10000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) private _allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);


    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     */
    constructor() {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }


    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }


    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) public returns (bool){
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }


    /**
    * Transfers _value amount of tokens from address _from to address _to, and MUST fire the Transfer event.
    */
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balances[from] >= value, "Not enough tokens");
        require(_allowance[from][msg.sender] >= value, "Not allowed");

        balances[from] -= value;
        balances[to] += value;
        _allowance[from][msg.sender] -= value;

        emit Transfer(from, to, value);
        return true;
    }


    /**
    * Allows _spender to withdraw from your account multiple times, up to the _value amount.
    * If this function is called again it overwrites the current allowance with _value.
    */
    function approve(address spender, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "Not enough tokens");

        _allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);
        return true;
    }


    /**
    * Returns the amount which _spender is still allowed to withdraw from _owner.
    */
    function allowance(address token_owner, address spender) public view returns (uint256) {
        return _allowance[token_owner][spender];
    }

    function burn(uint256 value) public returns (bool) {
        require(owner == msg.sender, "Not owner");

        totalSupply -= value;
        return true;
    }

    function mint(uint256 value) public returns (bool) {
        require(owner == msg.sender, "Not owner");

        totalSupply += value;
        return true;
    }

}