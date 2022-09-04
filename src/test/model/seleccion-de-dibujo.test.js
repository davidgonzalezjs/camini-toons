import MokedAnimationDocument from "../../model/animation-document/MokedAnimationDocument";
import CaminiToons from "../../model/CaminiToons";

import { clickEvent, mouseUpEvent, mouseMoveEvent } from '../helpers/mouse-event-factory'
import { deleteKeyPressEvent, keyPressEvent } from '../helpers/keyboard-event-factory'
import { mockPath, mockFunctionReturning } from "../helpers/mocks";
import Optional from "../../model/Optional";

describe('Seleccion de dibujo', () => {
    let animationDocument;
    let caminiToons;

    beforeEach(() => {
        animationDocument = new MokedAnimationDocument();
        caminiToons = new CaminiToons(animationDocument);
        caminiToons.useSelectionTool();
    });

    it('cuando se hace click con la herramienta de selección por fuera de un dibujo no se lo selecciona', () => {
        const aClickEvent = clickEvent();
        animationDocument.hitTest = mockFunctionReturning(Optional.empty());
        
        caminiToons.handleMouseDown(aClickEvent);
        
        expect(animationDocument.hitTest).toBeCalledWith(aClickEvent.point);
        expect(animationDocument.selectDrawing).not.toBeCalled();
    });

    it('cuando se hace click con la herramienta de selección sobre un dibujo se lo selecciona', () => {
        const aClickEvent = clickEvent();
        const aDrawing = mockPath();
        animationDocument.hitTest = mockFunctionReturning(Optional.with(aDrawing));

        caminiToons.handleMouseDown(aClickEvent);
        
        expect(animationDocument.hitTest).toBeCalledWith(aClickEvent.point);
        expect(animationDocument.selectDrawing).toBeCalledWith(aDrawing);
    });

    it('cuando se hace click con la herramienta de selección por fuera de un dibujo que estaba seleccionado entonces deja de estarlo', () => {
        const aClickEvent = clickEvent();
        const aDrawing = mockPath();
        animationDocument.hitTest = mockFunctionReturning(Optional.empty());

        caminiToons.handleMouseDown(aClickEvent);
        
        expect(animationDocument.hitTest).toBeCalledWith(aClickEvent.point);
        expect(animationDocument.deselectAllDrawings).toBeCalled();
        expect(animationDocument.selectDrawing).not.toBeCalledWith(aDrawing);
    });

    it('cuando se cambia de herramienta se deseleccionan todos los dibujos seleccionados', () => {
        caminiToons.usePen();

        expect(animationDocument.deselectAllDrawings).toBeCalled();
    });

    it('cuando se presiona la tecla DELETE estando seleccionada la herramienta de seleccion se eliminan los elementos seleccionados', () => {
        caminiToons.handleKeyDown(deleteKeyPressEvent);

        expect(animationDocument.deleteSelection).toBeCalled();
    });

    it('cuando se presiona la tecla DELETE no estando seleccionada la herramienta de seleccion no se eliminan los elementos seleccionados', () => {
        caminiToons.handleKeyDown(keyPressEvent('x'));

        expect(animationDocument.deleteSelection).not.toBeCalled();
    });

    it('cuando se mantiene clickeado un dibujo y se mueve el mouse, se lo mueve', () => {
        const aDrawing = mockPath();
        animationDocument.hitTest = mockFunctionReturning(Optional.with(aDrawing));

        const aClickEvent = clickEvent();
        caminiToons.handleMouseDown(aClickEvent);

        const aMouseMoveEvent = mouseMoveEvent({delta: {x: 10, y: 20}});
        caminiToons.handleMouseMove(aMouseMoveEvent);
        
        expect(animationDocument.moveDrawing).toBeCalledWith(aDrawing, aMouseMoveEvent.delta);
    });

    it('cuando se esta moviendo un dibujo con el mouse y se desclickea, se lo deja de mover', () => {
        const aDrawing = mockPath();
        animationDocument.hitTest = mockFunctionReturning(Optional.with(aDrawing));

        caminiToons.handleMouseDown(clickEvent());
        caminiToons.handleMouseMove(mouseMoveEvent({delta: {x: 10, y: 20}}));
        caminiToons.handleMouseUp(mouseUpEvent());

        caminiToons.handleMouseMove(mouseMoveEvent({delta: {x: 11, y: 22}}));
        
        expect(animationDocument.moveDrawing).toBeCalledTimes(1);
    });
    
});