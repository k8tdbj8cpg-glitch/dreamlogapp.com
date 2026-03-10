# Copilot Instructions

## New Directories

### lib/api/
This directory contains the API services for the application. It handles external requests and responses.

### lib/context/
This directory is used for managing the application's context state, allowing different parts of the application to share data and functionality effectively.

## Code Style Constraints

1. **Block Statement**: Use block statements for loops and conditional statements to enhance readability and maintainability of the code.
   - Example:
     ```javascript
     if (condition) {
         // do something
     }
     ```

2. **No Parameter Property**: Avoid using parameter properties in class constructors to keep the code cleaner and less confusing.
   - Example of incorrect usage:
     ```javascript
     class Example {
         constructor(public param) {}
     }
     ```

   - Instead, prefer:
     ```javascript
     class Example {
         private param: string;
         constructor(param: string) {
             this.param = param;
         }
     }
     ```

## AI Model Defaults
The application is configured with default settings for the AI models used. Ensure that these defaults are reviewed and adjusted as needed to meet your specific application requirements.

## Note on Firewall Rules
Please be aware that firewall rules might block connections to the API. Make sure to configure your firewall properly to allow necessary connections to function correctly.