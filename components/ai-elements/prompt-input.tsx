// Reverting to the version at commit 0c16d547d801859dee155507077ef04a85972945
// Original content based on the commit

import React from 'react';
import { TextInput } from 'react-native';

const PromptInput = ({ onChangeText }) => {
    return (
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={onChangeText}
            placeholder="Type your prompt here"
        />
    );
};

export default PromptInput;