<PromptInputButton
  {...props}
  className={cn(...)}
  disabled={false}
  onClick={() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported on this device");
    const recognition = new SR();
    recognition.onresult = (e) => controller.setText(e.results[0][0].transcript);
    recognition.start();
  }}
>
  <MicIcon />
</PromptInputButton>