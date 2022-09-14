class timer_ 
{
    seconds = 0;
    minutes = 0;
    hours = 0;
    days = 0;

    timer_() 
        { return; }

    increment() 
    {
        if (this.seconds < 59) 
            { this.seconds++; }
        else 
        {
            this.seconds = 0;
            
            if (this.minutes < 59)  
                { this.minutes++; }
            else 
            {
                this.minutes = 0;
                
                if (this.hours < 23) 
                    { this.hours++; }
                else 
                {
                    this.hours = 0;
                    this.days++;
                }
            }
        }

        return `\r\x1b[kUptime: ${this.days}d, ${this.hours}h, ${this.minutes}m, ${this.seconds}s`;
    }
};

module.exports = timer_