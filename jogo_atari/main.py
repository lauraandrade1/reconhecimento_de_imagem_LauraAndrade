import pygame
from settings import *
from game import Game

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Atari Space Shooter")
    clock = pygame.time.Clock()
    
    game = Game()
    running = True
    
    while running:
        running = game.process_events()
        game.run_logic()
        game.display_frame(screen)
        clock.tick(FPS)
        
    pygame.quit()

if __name__ == "__main__":
    main()
