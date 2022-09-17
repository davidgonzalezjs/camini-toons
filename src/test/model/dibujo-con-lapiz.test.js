import LessMokedAnimationDocument from "../../model/animation-document/LessMokedAnimationDocument";
import Clock from "../../model/Clock";
import CaminiToons from "../../model/CaminiToons";

import { clickEvent, mouseDragEvent, mouseUpEvent } from '../helpers/mouse-event-factory'
import { mockPath, mockFunctionReturning, mockFunctionReturningSequence } from "../helpers/mocks";

describe('Dibujo con lapiz', () => {
    let animationDocument;
    let caminiToons;

    beforeEach(() => {
        animationDocument = new LessMokedAnimationDocument();
        caminiToons = new CaminiToons(animationDocument, new Clock({frameRate: 6}));
    });

    it('cuando se hace click sobre el lienzo se dibuja un punto', () => {
        const mockedPath = mockPath();
        animationDocument.createPath = mockFunctionReturning(mockedPath);
        
        caminiToons.handleMouseDown(clickEvent({x: 10, y: 20}))
        
        expect(animationDocument.createPath).toBeCalledTimes(1);
    
        expect(mockedPath.add).toBeCalledTimes(1);
        
        expect(mockedPath.add.mock.calls[0][0].x).toBe(10);
        expect(mockedPath.add.mock.calls[0][0].y).toBe(20);
    });

    it('cuando se hace click sobre el lienzo y se mueve el mouse se dibuja un trazo', () => {
        const mockedPath = mockPath();
        animationDocument.createPath = mockFunctionReturning(mockedPath);
        
        caminiToons.handleMouseDown(clickEvent({x: 10, y: 20}))
        caminiToons.handleMouseMove(mouseDragEvent({x: 15, y: 25}))
        
        expect(animationDocument.createPath).toBeCalledTimes(1);

        expect(mockedPath.add).toBeCalledTimes(2);
        
        expect(mockedPath.add.mock.calls[0][0].x).toBe(10);
        expect(mockedPath.add.mock.calls[0][0].y).toBe(20);
        
        expect(mockedPath.add.mock.calls[1][0].x).toBe(15);
        expect(mockedPath.add.mock.calls[1][0].y).toBe(25);
    });
    
    it('si mientras se estaba dibujando un trazo se desclickea el mouse y se lo mueve ya no se sigue dibujando', () => {
        caminiToons.handleMouseDown(clickEvent({x: 10, y: 20}))
        caminiToons.handleMouseMove(mouseDragEvent({x: 15, y: 25}))
        caminiToons.handleMouseUp(mouseUpEvent({x: 15, y: 25}))

        caminiToons.handleMouseMove(mouseDragEvent({x: 17, y: 27}))

        expect(animationDocument.createPath).toBeCalledTimes(1);
    });

    it('si luego de dibujar un trazo se vuelve a hacer click se comienza un nuevo dibujo', () => {
        const firstMockedPath = mockPath();
        const secondMockedPath = mockPath();
        animationDocument.createPath = mockFunctionReturningSequence([firstMockedPath, secondMockedPath]);
        
        caminiToons.handleMouseDown(clickEvent({x: 11, y: 12}))
        caminiToons.handleMouseMove(mouseDragEvent({x: 21, y: 22}))
        caminiToons.handleMouseUp(mouseUpEvent({x: 21, y: 22}))
        
        caminiToons.handleMouseDown(clickEvent({x: 31, y: 32}))
        
        expect(animationDocument.createPath).toBeCalledTimes(2);

        expect(firstMockedPath.add).toBeCalledTimes(2);
        
        expect(firstMockedPath.add.mock.calls[0][0].x).toBe(11);
        expect(firstMockedPath.add.mock.calls[0][0].y).toBe(12);

        expect(firstMockedPath.add.mock.calls[1][0].x).toBe(21);
        expect(firstMockedPath.add.mock.calls[1][0].y).toBe(22);
        
        expect(secondMockedPath.add).toBeCalledTimes(1);

        expect(secondMockedPath.add.mock.calls[0][0].x).toBe(31);
        expect(secondMockedPath.add.mock.calls[0][0].y).toBe(32);
    });

    it('cuando se cambia el lapiz por una herramienta que no es de dibujo y se hace click no se dibuja ningun trazo', () => { 
        caminiToons.useSelectionTool();
        
        caminiToons.handleMouseDown(clickEvent());

        expect(animationDocument.createPath).toBeCalledTimes(0);
    });

    it('cuando se cambia una herramienta que no es de dibujo por el lapiz y se hace click se puede dibujar', () => { 
        caminiToons.useSelectionTool();

        caminiToons.usePen();
        
        caminiToons.handleMouseDown(clickEvent());

        expect(animationDocument.createPath).toBeCalledTimes(1);
    })
});