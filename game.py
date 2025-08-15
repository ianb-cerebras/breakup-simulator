import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Game constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
GRAVITY = 0.5
JUMP_STRENGTH = -10
BIRD_SIZE = 30
TEXT_WIDTH = 100
TEXT_HEIGHT = 200
TEXT_GAP = 250
TEXT_SPEED = 3
FONT_SIZE = 36
GROUND_HEIGHT = 50

# Colors - retro palette
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 50, 50)
GREEN = (50, 255, 100)
BLUE = (50, 150, 255)
YELLOW = (255, 255, 50)
PURPLE = (200, 50, 200)
CYAN = (50, 200, 255)
ORANGE = (255, 150, 50)
PINK = (255, 100, 150)
DARK_BLUE = (20, 70, 150)
DARK_GREEN = (30, 100, 50)

# Set up the display
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Boss Message Avoider - Flappy Bird Style")
clock = pygame.time.Clock()

# Font setup
font = pygame.font.Font(None, FONT_SIZE)
small_font = pygame.font.Font(None, 24)
title_font = pygame.font.Font(None, 48)

# Bird class with retro styling
class Bird:
    def __init__(self):
        self.x = 100
        self.y = SCREEN_HEIGHT // 2
        self.velocity = 0
        self.alive = True
        self.flap_counter = 0
        self.flap_animation = 0
    
    def jump(self):
        self.velocity = JUMP_STRENGTH
        self.flap_animation = 5  # Flap animation frames
    
    def update(self):
        self.velocity += GRAVITY
        self.y += self.velocity
        
        # Update flap animation
        if self.flap_animation > 0:
            self.flap_animation -= 1
        
        # Check if bird hits the ground or ceiling
        if self.y >= SCREEN_HEIGHT - GROUND_HEIGHT - BIRD_SIZE or self.y <= 0:
            self.alive = False
    
    def draw(self):
        # Draw bird body (retro pixel art style)
        pygame.draw.rect(screen, YELLOW, (self.x, self.y, BIRD_SIZE, BIRD_SIZE))
        
        # Draw bird eye
        pygame.draw.rect(screen, BLACK, (self.x + 20, self.y + 8, 6, 6))
        
        # Draw bird beak
        pygame.draw.polygon(screen, ORANGE, [
            (self.x + BIRD_SIZE, self.y + 15),
            (self.x + BIRD_SIZE + 8, self.y + 10),
            (self.x + BIRD_SIZE + 8, self.y + 20)
        ])
        
        # Draw wing based on flap animation
        wing_y_offset = 0
        if self.flap_animation > 0:
            wing_y_offset = -3 if self.flap_animation % 2 == 0 else 0
            
        pygame.draw.rect(screen, PINK, (self.x + 5, self.y + 15 + wing_y_offset, 15, 8))
    
    def get_rect(self):
        return pygame.Rect(self.x, self.y, BIRD_SIZE, BIRD_SIZE)

# Boss message obstacle class with retro styling
class BossMessage:
    def __init__(self, x):
        self.x = x
        # Create a gap for the bird to pass through
        self.gap_y = random.randint(150, SCREEN_HEIGHT - 150 - TEXT_GAP)
        self.top_rect = pygame.Rect(self.x, 0, TEXT_WIDTH, self.gap_y)
        self.bottom_rect = pygame.Rect(self.x, self.gap_y + TEXT_GAP, TEXT_WIDTH, SCREEN_HEIGHT - self.gap_y - TEXT_GAP)
        self.passed = False
        self.animation_counter = 0
        
        # Different toxic ex messages
        self.ex_messages = [
            "We need to talk",
            "Where have you been?",
            "Why won't you answer my texts?",
            "I know you're online",
            "You owe me an explanation",
            "Everyone says you've changed",
            "Are you seeing someone else?",
            "I'm not letting go that easily",
            "You can't just ignore me forever",
            "I saw you post them on Instagram",
            "Do you even care about our relationship?",
            "I thought we had something special",
            "You're making this too complicated",
            "Come back to me",
            "I'll wait for you no matter how long",
            "You're just confused about your feelings",
            "Don't you miss us?",
            "I'm not the problem here",
            "I didn't mean to hurt you",
            "Can we just go back to how things were?",
            "You're overthinking this",
            "I still love you",
            "Why are you doing this to me?",
            "You're making me crazy",
            "I can't eat or sleep without you",
            "This is all your fault",
            "You're being selfish",
            "I'm not going to give up on us",
            "You're just scared of commitment",
            "I know what's best for you",
            "You don't know what you want",
            "I'm the only one who understands you",
            "You're making a huge mistake",
            "I'll make you happy again",
            "You're just going through a phase",
            "Don't throw away everything we had",
            "I'm not like your other relationships",
            "You're being too sensitive",
            "I was just joking around",
            "You're taking things too seriously",
            "I never got to say goodbye properly",
            "You're being dramatic",
            "I can change, just give me another chance",
            "You're being too hard on me",
            "I didn't cheat, we were on a break",
            "You're being unreasonable",
            "I'm not the person you think I am",
            "You're being too picky",
            "I was going to tell you eventually",
            "You're being too controlling",
            "I'm not trying to hurt you",
            "You're so jealous",
            "You're being too insecure",
            "I'm not trying to manipulate you",
            "You're being too emotional",
            "What does gaslighting even mean",
            "Stop being so needy",
            "I'm not trying to ignore you",
            "You're being too dependent",
            "I'm not trying to make you crazy"
        ]
        
        self.top_message = random.choice(self.ex_messages)
        self.bottom_message = random.choice(self.ex_messages)
    
    def update(self):
        self.x -= TEXT_SPEED
        self.top_rect.x = self.x
        self.bottom_rect.x = self.x
        self.animation_counter += 1
    
    def draw(self):
        # Draw top boss message obstacle with retro styling
        pygame.draw.rect(screen, RED, self.top_rect)
        pygame.draw.rect(screen, DARK_GREEN, (self.x, self.gap_y - 5, TEXT_WIDTH, 5))
        
        # Draw bottom boss message obstacle
        pygame.draw.rect(screen, RED, self.bottom_rect)
        pygame.draw.rect(screen, DARK_GREEN, (self.x, self.gap_y + TEXT_GAP, TEXT_WIDTH, 5))
        
        # Draw boss messages on the obstacles with retro styling
        top_text_surface = small_font.render(self.top_message, True, WHITE)
        bottom_text_surface = small_font.render(self.bottom_message, True, WHITE)
        
        # Add a slight bounce animation to the text
        bounce = 2 * pygame.math.Vector2(0, 1).rotate(self.animation_counter * 2).y
        
        screen.blit(top_text_surface, (self.x + 10, self.gap_y - 30 + bounce))
        screen.blit(bottom_text_surface, (self.x + 10, self.gap_y + TEXT_GAP + 10 + bounce))
        
        # # Draw decorative elements instead of phone icons
        # # Draw a heart on top of texts (representing unwanted affection)
        # pygame.draw.circle(screen, PINK, (self.x + TEXT_WIDTH - 20, self.gap_y - 25), 5)
        # pygame.draw.circle(screen, PINK, (self.x + TEXT_WIDTH - 10, self.gap_y - 25), 5)
        # pygame.draw.polygon(screen, PINK, [
        #     (self.x + TEXT_WIDTH - 25, self.gap_y - 20),
        #     (self.x + TEXT_WIDTH - 5, self.gap_y - 20),
        #     (self.x + TEXT_WIDTH - 15, self.gap_y - 5)
        # ])
        
        # # Draw a heart on bottom texts
        # pygame.draw.circle(screen, PINK, (self.x + TEXT_WIDTH - 20, self.gap_y + TEXT_GAP + 25), 5)
        # pygame.draw.circle(screen, PINK, (self.x + TEXT_WIDTH - 10, self.gap_y + TEXT_GAP + 25), 5)
        # pygame.draw.polygon(screen, PINK, [
        #     (self.x + TEXT_WIDTH - 25, self.gap_y + TEXT_GAP + 30),
        #     (self.x + TEXT_WIDTH - 5, self.gap_y + TEXT_GAP + 30),
        #     (self.x + TEXT_WIDTH - 15, self.gap_y + TEXT_GAP + 45)
        # ])
    
    def collide(self, bird):
        bird_rect = bird.get_rect()
        return bird_rect.colliderect(self.top_rect) or bird_rect.colliderect(self.bottom_rect)

# Background elements for retro feel
class Background:
    def __init__(self):
        self.clouds = []
        self.stars = []
        self.ground_points = []
        
        # Generate clouds
        for i in range(5):
            self.clouds.append({
                'x': random.randint(0, SCREEN_WIDTH),
                'y': random.randint(50, 200),
                'size': random.randint(30, 60)
            })
        
        # Generate stars
        for i in range(50):
            self.stars.append({
                'x': random.randint(0, SCREEN_WIDTH),
                'y': random.randint(0, SCREEN_HEIGHT - GROUND_HEIGHT),
                'size': random.randint(1, 3),
                'brightness': random.randint(100, 255)
            })
        
        # Generate ground points for a pixelated look
        for i in range(0, SCREEN_WIDTH, 20):
            self.ground_points.append({
                'x': i,
                'height': random.randint(10, GROUND_HEIGHT)
            })
    
    def update(self):
        # Move clouds slowly
        for cloud in self.clouds:
            cloud['x'] -= 0.5
            if cloud['x'] < -100:
                cloud['x'] = SCREEN_WIDTH + 50
                cloud['y'] = random.randint(50, 200)
    
    def draw(self):
        # Draw sky gradient (retro style)
        for y in range(SCREEN_HEIGHT - GROUND_HEIGHT):
            # Create a gradient from dark blue to lighter blue
            color_value = max(50, 150 - y // 4)
            pygame.draw.line(screen, (color_value, color_value, 255), (0, y), (SCREEN_WIDTH, y))
        
        # Draw stars
        for star in self.stars:
            brightness = star['brightness']
            color = (brightness, brightness, brightness)
            pygame.draw.rect(screen, color, (star['x'], star['y'], star['size'], star['size']))
        
        # Draw clouds
        for cloud in self.clouds:
            pygame.draw.rect(screen, WHITE, (cloud['x'], cloud['y'], cloud['size'], cloud['size'] // 2))
            pygame.draw.rect(screen, WHITE, (cloud['x'] + cloud['size'] // 3, cloud['y'] - cloud['size'] // 4, 
                                            cloud['size'] // 2, cloud['size'] // 2))
            pygame.draw.rect(screen, WHITE, (cloud['x'] + cloud['size'] // 1.5, cloud['y'], cloud['size'] // 2, 
                                            cloud['size'] // 3))

# Game class
class Game:
    def __init__(self):
        self.bird = Bird()
        self.texts = []
        self.background = Background()
        self.score = 0
        self.font = pygame.font.Font(None, FONT_SIZE)
        self.game_state = "start"  # "start", "playing", "game_over"
        
        # Add initial boss messages
        self.add_text(SCREEN_WIDTH + 200)
        self.add_text(SCREEN_WIDTH + 500)
    
    def add_text(self, x):
        self.texts.append(BossMessage(x))
    
    def update(self):
        # Update background
        self.background.update()
        
        if self.game_state != "playing":
            return
            
        # Update bird
        self.bird.update()
        
        # Update boss messages
        for text in self.texts:
            text.update()
            
            # Check collision
            if text.collide(self.bird):
                self.bird.alive = False
            
            # Check if bird passed the message
            if not text.passed and text.x < self.bird.x:
                text.passed = True
                self.score += 1
        
        # Remove messages that are off screen
        self.texts = [text for text in self.texts if text.x > -TEXT_WIDTH]
        
        # Add new messages
        if len(self.texts) == 0 or self.texts[-1].x < SCREEN_WIDTH - 200:
            self.add_text(SCREEN_WIDTH + 200)
        
        # Check if bird is dead
        if not self.bird.alive:
            self.game_state = "game_over"
    
    def draw(self):
        # Draw background
        self.background.draw()
        
        # Draw ground
        pygame.draw.rect(screen, DARK_GREEN, (0, SCREEN_HEIGHT - GROUND_HEIGHT, SCREEN_WIDTH, GROUND_HEIGHT))
        
        # Draw pixelated ground details
        for point in self.background.ground_points:
            pygame.draw.rect(screen, GREEN, (point['x'], SCREEN_HEIGHT - point['height'], 15, point['height']))
        
        # Draw boss messages
        if self.game_state == "playing" or self.game_state == "game_over":
            for text in self.texts:
                text.draw()
        
        # Draw bird
        self.bird.draw()
        
        # Draw score
        score_text = self.font.render(f"Score: {self.score}", True, WHITE)
        screen.blit(score_text, (10, 10))
        
        # Draw game state messages
        if self.game_state == "start":
            title_text = title_font.render("TOXIC EX AVOIDER", True, YELLOW)
            subtitle_text = font.render("Avoid those pesky texts messages!", True, WHITE)
            start_text = font.render("Press SPACE to Start", True, GREEN)
            
            screen.blit(title_text, (SCREEN_WIDTH // 2 - title_text.get_width() // 2, SCREEN_HEIGHT // 3))
            screen.blit(subtitle_text, (SCREEN_WIDTH // 2 - subtitle_text.get_width() // 2, SCREEN_HEIGHT // 3 + 50))
            screen.blit(start_text, (SCREEN_WIDTH // 2 - start_text.get_width() // 2, SCREEN_HEIGHT // 2 + 100))
            
            # Draw instructions
            instructions = [
                "CONTROLS:",
                "- SPACE: Jump/Start",
                "- R: Restart after game over"
            ]
            
            for i, instruction in enumerate(instructions):
                inst_text = small_font.render(instruction, True, WHITE)
                screen.blit(inst_text, (SCREEN_WIDTH // 2 - inst_text.get_width() // 2, SCREEN_HEIGHT // 2 + 150 + i * 30))
                
        elif self.game_state == "game_over":
            game_over_text = title_font.render("GAME OVER!", True, RED)
            score_text = font.render(f"Final Score: {self.score}", True, WHITE)
            restart_text = font.render("Press R to Restart", True, GREEN)
            
            screen.blit(game_over_text, (SCREEN_WIDTH // 2 - game_over_text.get_width() // 2, SCREEN_HEIGHT // 3))
            screen.blit(score_text, (SCREEN_WIDTH // 2 - score_text.get_width() // 2, SCREEN_HEIGHT // 3 + 60))
            screen.blit(restart_text, (SCREEN_WIDTH // 2 - restart_text.get_width() // 2, SCREEN_HEIGHT // 2 + 50))
    
    def handle_event(self, event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                if self.game_state == "start":
                    self.game_state = "playing"
                elif self.game_state == "playing":
                    self.bird.jump()
                elif self.game_state == "game_over":
                    pass  # We handle restart with R key
            
            if event.key == pygame.K_r and self.game_state == "game_over":
                self.restart()
    
    def restart(self):
        self.bird = Bird()
        self.texts = []
        self.score = 0
        self.game_state = "playing"
        self.add_text(SCREEN_WIDTH + 200)
        self.add_text(SCREEN_WIDTH + 500)

# Create game instance
game = Game()

# Main game loop
running = True
while running:
    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        game.handle_event(event)
    
    # Update game state
    game.update()
    
    # Draw everything
    game.draw()
    
    # Update display
    pygame.display.flip()
    
    # Cap the frame rate
    clock.tick(60)

pygame.quit()
sys.exit()
